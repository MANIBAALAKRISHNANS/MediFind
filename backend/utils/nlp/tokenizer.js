// Text normalisation + tokenization for the local diagnosis engine.
// This is the single choke point every piece of text passes through before
// matching — user input, disease symptom names, risk factors — so that
// authors of disease entries can write natural phrasing ("runny nose")
// and it still matches user input phrased differently ("running nose"),
// and vice versa.
import { SYNONYM_MAP } from './synonyms.js'

// Longest phrases first, so multi-word synonyms ("shortness of breath")
// are replaced before any of their shorter sub-phrases could partially match.
const SYNONYM_ENTRIES = Object.entries(SYNONYM_MAP).sort(
  (a, b) => b[0].length - a[0].length,
)

/**
 * Strips punctuation, collapses whitespace, and lowercases raw text.
 * Does NOT apply synonym replacement — use normalize() for that.
 */
function basicClean(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')   // strip punctuation (keeps letters/digits/spaces)
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Memoization ───────────────────────────────────────────────────────────
// localDiagnose() calls normalize() on every symptom/red_flag/risk_factor
// name of every one of the 275 DISEASE_DB entries, on EVERY request — around
// 3,300 calls, each looping the ~280-entry synonym list — to re-derive the
// SAME result for text that never changes between requests (only the user's
// own input text differs call to call). Measured impact: ~68ms/request of
// pure re-work, which compounds badly under concurrent load since this is
// synchronous CPU work on Node's single thread. normalize() is a pure
// function (same input always → same output), so memoizing it is a free,
// behavior-preserving win. Bounded FIFO cache (same pattern as
// utils/cache.js) rather than an unbounded Map, since unique free-form user
// input could otherwise grow it forever over a long-lived process.
const CACHE_CAP = 8000
const _cache = new Map()

function memoize(text, compute) {
  const cached = _cache.get(text)
  if (cached !== undefined) return cached

  const result = compute(text)

  if (_cache.size >= CACHE_CAP) {
    _cache.delete(_cache.keys().next().value)   // evict oldest (FIFO)
  }
  _cache.set(text, result)
  return result
}

/**
 * Full normalisation pipeline: clean → apply synonym map → clean again
 * (synonym replacement can introduce its own multi-word phrases that need
 * re-collapsing). This is what both user symptom text AND disease entry
 * symptom names are run through before any matching happens.
 */
export function normalize(text) {
  return memoize(text, computeNormalize)
}

function computeNormalize(text) {
  let cleaned = basicClean(text)
  if (!cleaned) return ''

  const padded = ` ${cleaned} `
  let result = padded
  for (const [phrase, canonical] of SYNONYM_ENTRIES) {
    const needle = ` ${phrase} `
    if (result.includes(needle)) {
      // Replace ALL occurrences of this phrase, not just the first.
      result = result.split(needle).join(` ${canonical} `)
    }
  }

  return basicClean(result)
}

/** Splits normalised text into individual word tokens. */
export function tokenize(text) {
  const normalized = normalize(text)
  return normalized ? normalized.split(' ') : []
}

export default { normalize, tokenize }
