// Proves two things about the in-memory fallback's per-pool caps:
//   1. Each pool evicts (FIFO) rather than silently refusing to write once
//      full, and the eviction is actually logged — so a real deployment
//      running without REDIS_URL under real load would see this in its logs
//      instead of just experiencing a mysteriously cold cache.
//   2. The pools are actually isolated: filling one past its cap does NOT
//      evict the other pool's entries. This is the core guarantee the
//      default/overpass split exists for — a burst of Overpass writes (up
//      to 5 per find-doctor request) must not be able to evict fresh
//      diagnosis-cache entries, or vice versa.
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { cacheGet, cacheSet } from '../utils/cache.js'

const ANALYZE_JS_PATH = fileURLToPath(new URL('../routes/analyze.js', import.meta.url))

// ── Balanced call-argument parsing ───────────────────────────────────────────
// A naive /fnName\(([^)]*)\)/ regex + .split(',') breaks the moment an
// argument is anything other than a plain identifier: `[^)]*` stops at the
// FIRST ')' it meets, truncating early if an argument contains a nested call
// like f(a, b); and .split(',') over-counts commas that are actually inside
// an inline object/array literal (`{ x: 1, y: 2 }` would look like 2 args).
// analyze.js's current calls happen to use plain variable references, so the
// naive version would pass today — but only by accident of what the file
// currently contains, not because the check is actually correct. These two
// helpers track (){}[] nesting depth and string-literal boundaries so the
// check keeps working if that ever changes.

/**
 * Finds every top-level call to `fnName(...)` in `source` and returns each
 * one's raw argument-list text (the substring between the matching '(' and
 * ')'), found by walking character-by-character and tracking paren/brace/
 * bracket nesting depth and string-literal state — not by regex alone.
 */
function findCallArgLists(source, fnName) {
  const results = []
  const callStart = new RegExp(`\\b${fnName}\\s*\\(`, 'g')
  let match

  while ((match = callStart.exec(source)) !== null) {
    const argsStart = match.index + match[0].length // just past the opening '('
    let depth = 1
    let quote = null // active string-literal quote char ('"`), or null
    let i = argsStart

    while (i < source.length && depth > 0) {
      const ch = source[i]
      if (quote) {
        if (ch === '\\') { i += 2; continue }   // skip an escaped char inside the string
        if (ch === quote) quote = null
      } else if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch
      } else if (ch === '(' || ch === '[' || ch === '{') {
        depth++
      } else if (ch === ')' || ch === ']' || ch === '}') {
        depth--
      }
      i++
    }

    results.push(source.slice(argsStart, i - 1)) // i is just past the matching ')'
  }

  return results
}

/**
 * Splits a raw argument-list string on top-level commas only — commas nested
 * inside (), [], {}, or a string literal never split the list, so a single
 * argument that happens to be an object/array literal (or a string
 * containing a literal comma) is never miscounted as multiple arguments.
 */
function splitTopLevelArgs(argsText) {
  const trimmed = argsText.trim()
  if (!trimmed) return []

  const args = []
  let depth = 0
  let quote = null
  let current = ''

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]
    if (quote) {
      current += ch
      if (ch === '\\') { current += trimmed[++i] ?? ''; continue }
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      current += ch
    } else if (ch === '(' || ch === '[' || ch === '{') {
      depth++
      current += ch
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--
      current += ch
    } else if (ch === ',' && depth === 0) {
      args.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) args.push(current.trim())
  return args
}

// Must match utils/cache.js's POOL_CAPACITY.
const DEFAULT_POOL_CAP  = 500
const OVERPASS_POOL_CAP = 1500

async function fillPool(prefix, count, pool) {
  for (let i = 0; i < count; i++) {
    await cacheSet(`${prefix}${i}`, { i }, undefined, pool)
  }
}

describe('cache — in-memory per-pool eviction', () => {
  test('the default pool evicts the oldest entry (FIFO) once full, and logs it — not a silent stop', async (t) => {
    const logs = []
    const originalWarn = console.warn
    console.warn = (...args) => { logs.push(args.join(' ')) }
    t.after(() => { console.warn = originalWarn })

    const prefix = `test:evict:default:${Date.now()}:`
    const count = DEFAULT_POOL_CAP + 1
    await fillPool(prefix, count, 'default')

    assert.equal(
      await cacheGet(`${prefix}0`, 'default'), null,
      'the oldest entry written should have been evicted once the default pool cap was hit',
    )
    assert.deepEqual(
      await cacheGet(`${prefix}${count - 1}`, 'default'), { i: count - 1 },
      'the most recently written entry should still be present',
    )
    assert.ok(
      logs.some((l) => l.includes('[cache:default]') && l.includes('entry cap')),
      'eviction must be visible in the logs, tagged with the pool it happened in',
    )
  })

  test('the overpass pool evicts independently, with its own (larger) cap and its own log tag', async (t) => {
    const logs = []
    const originalWarn = console.warn
    console.warn = (...args) => { logs.push(args.join(' ')) }
    t.after(() => { console.warn = originalWarn })

    const prefix = `test:evict:overpass:${Date.now()}:`
    const count = OVERPASS_POOL_CAP + 1
    await fillPool(prefix, count, 'overpass')

    assert.equal(await cacheGet(`${prefix}0`, 'overpass'), null)
    assert.deepEqual(await cacheGet(`${prefix}${count - 1}`, 'overpass'), { i: count - 1 })
    assert.ok(logs.some((l) => l.includes('[cache:overpass]') && l.includes('entry cap')))
  })

  test('pools are isolated — overfilling one does not evict entries from the other', async (t) => {
    const stamp = Date.now()
    const overpassKey = `test:isolation:overpass:${stamp}`
    const defaultKey  = `test:isolation:default:${stamp}`

    // Write one entry to each pool first.
    await cacheSet(overpassKey, { marker: 'overpass' }, undefined, 'overpass')
    await cacheSet(defaultKey, { marker: 'default' }, undefined, 'default')

    // Now hammer the DEFAULT pool with a burst well past its cap — simulating
    // a wave of diagnosis-cache traffic — and confirm the overpass entry
    // written just above survives untouched.
    await fillPool(`test:isolation:burst-default:${stamp}:`, DEFAULT_POOL_CAP + 50, 'default')
    assert.deepEqual(
      await cacheGet(overpassKey, 'overpass'), { marker: 'overpass' },
      'a burst of default-pool writes must not evict an overpass-pool entry',
    )

    // And the reverse: hammer the OVERPASS pool — simulating a burst of
    // find-doctor requests (up to 5 writes each) — and confirm the earlier
    // default-pool entry survives. Note: it may have already been evicted by
    // the default-pool burst above (expected — same-pool eviction), so this
    // specifically re-writes a fresh default-pool marker right before the
    // overpass burst to isolate what's being tested.
    await cacheSet(defaultKey, { marker: 'default-refreshed' }, undefined, 'default')
    await fillPool(`test:isolation:burst-overpass:${stamp}:`, OVERPASS_POOL_CAP + 50, 'overpass')
    assert.deepEqual(
      await cacheGet(defaultKey, 'default'), { marker: 'default-refreshed' },
      'a burst of overpass-pool writes must not evict a default-pool entry',
    )
  })
})

// ── Regression: analyze.js's existing (pre-split) call signature ────────────
// analyze.js was never updated to pass a `pool` argument — it still calls
// cacheGet(key) / cacheSet(key, value) exactly as it did before the
// default/overpass split. This must keep routing to the 'default' pool
// (matching its diagnosis-cache role and 500-entry cap), not silently land
// nowhere, and not accidentally land in 'overpass'.
describe('cache — analyze.js pool-split regression', () => {
  test('self-check: splitTopLevelArgs is not fooled by an inline object/array literal argument', () => {
    // analyze.js's real calls only ever pass plain variable references
    // (cacheKey, diagnosis) — so this suite never actually exercises the
    // nested-literal path against real source. This proves the parser
    // itself would get it right if that ever changed, using synthetic input.
    assert.deepEqual(
      splitTopLevelArgs('a, { x: 1, y: [1, 2, 3] }, b'),
      ['a', '{ x: 1, y: [1, 2, 3] }', 'b'],
      'a single object/array-literal argument must not be split on its internal commas',
    )
    assert.deepEqual(
      splitTopLevelArgs('key, computeValue(a, b), "a, b, c"'),
      ['key', 'computeValue(a, b)', '"a, b, c"'],
      'commas inside a nested call or a string literal must not split the argument list either',
    )
    assert.deepEqual(splitTopLevelArgs('onlyArg'), ['onlyArg'])
    assert.deepEqual(splitTopLevelArgs(''), [])
  })

  test('self-check: findCallArgLists finds the true matching close-paren even with a nested call', () => {
    const synthetic = 'cacheSet(cacheKey, computeValue(a, b), 5000)'
    assert.deepEqual(
      findCallArgLists(synthetic, 'cacheSet'),
      ['cacheKey, computeValue(a, b), 5000'],
      'must capture the whole argument list, not truncate at the nested call\'s closing paren',
    )
  })

  test('analyze.js source: neither cacheGet nor cacheSet call passes a pool argument', () => {
    const source = readFileSync(ANALYZE_JS_PATH, 'utf8')

    const cacheGetCalls = findCallArgLists(source, 'cacheGet')
    const cacheSetCalls = findCallArgLists(source, 'cacheSet')

    assert.equal(cacheGetCalls.length, 1, `expected exactly one cacheGet(...) call in analyze.js, found ${cacheGetCalls.length}`)
    assert.equal(cacheSetCalls.length, 1, `expected exactly one cacheSet(...) call in analyze.js, found ${cacheSetCalls.length}`)

    const cacheGetArgs = splitTopLevelArgs(cacheGetCalls[0])
    const cacheSetArgs = splitTopLevelArgs(cacheSetCalls[0])

    assert.equal(
      cacheGetArgs.length, 1,
      `analyze.js's cacheGet call must take exactly 1 argument (key only, no pool) — found (${cacheGetCalls[0]}). ` +
      'If this changed, the behavioral test below no longer reflects the real caller.',
    )
    assert.equal(
      cacheSetArgs.length, 2,
      `analyze.js's cacheSet call must take exactly 2 arguments (key, value — no ttlMs/pool) — found (${cacheSetCalls[0]}). ` +
      'If this changed, the behavioral test below no longer reflects the real caller.',
    )
  })

  test('cacheSet(key, value) / cacheGet(key) with no pool argument — analyze.js\'s exact call shape — route to the "default" pool', async (t) => {
    const logs = []
    const originalWarn = console.warn
    console.warn = (...args) => { logs.push(args.join(' ')) }
    t.after(() => { console.warn = originalWarn })

    const stamp = Date.now()
    const key = `test:no-pool-arg:${stamp}`
    const value = { marker: 'no-pool-arg-value' }

    // Exact same call shape as analyze.js line 205: cacheSet(key, value).
    await cacheSet(key, value)

    // Exact same call shape as analyze.js line 168: cacheGet(key).
    const retrieved = await cacheGet(key)
    assert.deepEqual(
      retrieved, value,
      'a value written with no pool argument must be retrievable with no pool argument — it landed in a real pool, not lost',
    )

    // Prove it specifically landed in the DEFAULT pool (not 'overpass', and
    // not some unpartitioned bucket): fill the default pool to its cap using
    // the SAME no-pool-argument signature, and confirm the resulting
    // eviction warning is tagged [cache:default] — never [cache:overpass].
    for (let i = 0; i < DEFAULT_POOL_CAP + 1; i++) {
      await cacheSet(`test:no-pool-arg:fill:${stamp}:${i}`, { i })   // still no pool argument
    }

    assert.ok(
      logs.some((l) => l.includes('[cache:default]') && /evict/i.test(l)),
      'filling via the no-pool-argument signature must trigger the DEFAULT pool\'s eviction warning',
    )
    assert.ok(
      !logs.some((l) => l.includes('[cache:overpass]')),
      'the no-pool-argument signature must never touch — or evict from — the overpass pool',
    )
  })
})
