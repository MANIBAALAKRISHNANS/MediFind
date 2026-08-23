// Unit test for utils/cache.js's per-call TTL support (added so
// routes/findDoctor.js's 20-minute Overpass cache and analyze.js's default
// 3-minute diagnosis cache can share the same store with independent
// lifetimes). No REDIS_URL is set in this test run, so this exercises the
// in-memory fallback specifically — see findDoctor.test.js's docstring and
// this file's bottom comment for what is and isn't covered for the Redis path.
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { cacheGet, cacheSet } from '../utils/cache.js'

describe('cache — per-call TTL (in-memory fallback)', () => {
  test('a longer custom TTL (e.g. the 20-minute Overpass TTL) outlives the default 3-minute diagnosis TTL', async (t) => {
    t.mock.timers.enable({ apis: ['Date'] })

    const shortKey = 'test:cache:default-ttl'
    const longKey  = 'test:cache:custom-20min-ttl'
    const TWENTY_MIN_MS = 20 * 60 * 1000

    await cacheSet(shortKey, { v: 'default-3min' })                   // uses cacheSet's default TTL
    await cacheSet(longKey, { v: 'custom-20min' }, TWENTY_MIN_MS)      // explicit TTL, as findDoctor.js passes

    // Advance past the default 3-minute TTL but still well inside 20 minutes.
    t.mock.timers.tick(4 * 60 * 1000)
    assert.equal(await cacheGet(shortKey), null, 'default-TTL entry should have expired by now')
    assert.deepEqual(await cacheGet(longKey), { v: 'custom-20min' }, 'the 20-minute entry must still be alive')

    // Advance past the 20-minute TTL too.
    t.mock.timers.tick(17 * 60 * 1000)
    assert.equal(await cacheGet(longKey), null, 'the 20-minute entry should now have expired too')
  })
})

// ── What this does NOT cover ─────────────────────────────────────────────────
// cacheSet/cacheGet take the Redis branch instead of the in-memory one when
// `redis?.status === 'ready'` — which requires a real, connected Redis
// instance (gated behind REDIS_URL at module load time). No Redis server is
// available in this environment (no local binary, no Docker), so that branch
// is not exercised by an automated test here. What IS verified by code
// review: the Redis branch calls `redis.set(key, JSON.stringify(value),
// 'PX', ttlMs)` with the exact same `ttlMs` parameter this test exercises
// above — not a hardcoded constant — and Redis's PX-based expiry is native,
// atomic (set value + TTL in one command, no window where a key exists
// without an expiry), and applies identically to every key regardless of its
// prefix. There is nothing prefix-specific in the cache module that could
// make `overpass:v1:*` keys behave differently from any other key.
