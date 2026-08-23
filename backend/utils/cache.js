// Shared cache layer — Redis when available, in-memory Map fallback otherwise.
// The app works identically without Redis; Redis only adds cross-process sharing
// and persistence across restarts (needed for horizontal scaling).
//
// Set REDIS_URL in .env to enable Redis: redis://localhost:6379
// Leave it unset to use the in-memory fallback (default for local dev).

import Redis from 'ioredis'

const CACHE_TTL_MS  = 3 * 60 * 1000   // 3-minute TTL for diagnosis results
const REDIS_URL     = process.env.REDIS_URL

// ── Redis client (lazy-initialised, fails silently) ───────────────────────────

let redis = null

if (REDIS_URL) {
  try {
    redis = new Redis(REDIS_URL, {
      lazyConnect:           true,
      connectTimeout:        3000,
      maxRetriesPerRequest:  1,
      enableOfflineQueue:    false,   // don't queue commands while disconnected
    })

    redis.on('error', (err) => {
      if (!err.message?.includes('ECONNREFUSED')) {
        console.error('[cache] Redis error:', err.message)
      }
    })

    await redis.connect()
    console.log('✅ Redis cache connected')
  } catch (err) {
    console.warn('[cache] Redis unavailable — falling back to in-memory cache:', err.message)
    redis = null
  }
} else {
  console.log('[cache] REDIS_URL not set — using in-memory cache (single-instance only)')
}

// ── In-memory fallback — one FIFO pool PER CACHE, not shared ─────────────────
// Redis itself needs no such split: its capacity is governed by its own
// maxmemory config, not by anything in this file, so `pool` only matters
// below (routing to the right in-memory Map when Redis isn't available).
//
// Why split: the two current callers have very different write/TTL profiles
//   - analyze.js's diagnosis cache: 3-min TTL, ~1 write per unique query.
//   - findDoctor.js's Overpass cache: 20-min TTL, up to 5 writes per single
//     find-doctor request (one per radius tier tried).
// A single shared FIFO queue evicts purely by insertion order, with no idea
// which entry belongs to which workload or how much life it has left. Do the
// math on realistic traffic: at 5 writes/request, as few as ~400 find-doctor
// searches inside one 20-minute window would already fill a shared 2000-slot
// pool — at which point a burst of Overpass writes could evict still-fresh
// diagnosis entries, or a burst of diagnosis writes could evict a
// barely-written Overpass entry with 19 minutes of life left, purely because
// it happened to be older. Separate pools mean a burst in one workload can
// only evict its own entries, never the other's.
//
// Per-pool cap sizing: diagnosis entries churn fast (3-min TTL) and don't
// need many slots to stay effective, so it keeps the original 500. The
// Overpass pool gets more headroom (1500) since it lives 5x longer and a
// single request can write up to 5 entries — combined this is the same
// 2000-entry total memory footprint as before, just partitioned so the two
// workloads can no longer starve each other.
//
// Not true LRU within a pool either — re-reading a key via cacheGet does not
// renew its position, only insertion order matters (a re-cacheSet on an
// already-present key also keeps its original position — Map semantics).
// Good enough for a fallback path production shouldn't be relying on anyway
// (see server.js's Redis degradation boot warning) — but eviction here is
// logged (throttled, below) so it's visible in production logs rather than a
// silent cache-effectiveness regression someone only notices indirectly via
// slower responses.

const POOL_CAPACITY = {
  default:  500,    // diagnosis cache (analyze.js)
  overpass: 1500,   // Overpass facility cache (routes/findDoctor.js)
}

function createPool(name) {
  return {
    name,
    maxEntries: POOL_CAPACITY[name] ?? POOL_CAPACITY.default,
    cache: new Map(),
    evictionCount: 0,
    hasWarnedFull: false,
  }
}

const pools = {
  default:  createPool('default'),
  overpass: createPool('overpass'),
}

function getPool(pool) {
  return pools[pool] ?? pools.default
}

function memGet(pool, key) {
  const p = getPool(pool)
  const entry = p.cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > entry.ttlMs) { p.cache.delete(key); return null }
  return entry.value
}

function memSet(pool, key, value, ttlMs) {
  const p = getPool(pool)
  if (p.cache.size >= p.maxEntries && !p.cache.has(key)) {
    // Delete the oldest entry (Map preserves insertion order) — FIFO, not LRU.
    p.cache.delete(p.cache.keys().next().value)
    p.evictionCount++
    if (!p.hasWarnedFull) {
      console.warn(
        `[cache:${p.name}] In-memory pool hit its ${p.maxEntries}-entry cap — evicting oldest entries (FIFO). ` +
        'Set REDIS_URL in production to avoid this (see server.js boot warning).'
      )
      p.hasWarnedFull = true
    } else if (p.evictionCount % 100 === 0) {
      console.warn(`[cache:${p.name}] In-memory pool still full — ${p.evictionCount} entries evicted so far.`)
    }
  }
  p.cache.set(key, { value, ts: Date.now(), ttlMs })
}

// ── Redis command-failure logging (throttled) ─────────────────────────────────
// Not split per pool — a Redis command failure is about connection/command
// health, not about which workload's data it was carrying, so all callers
// share one throttle. A sustained outage under real traffic would otherwise
// log one line per failed request — this logs the first failure immediately,
// then only every 100th, so degradation is visible without flooding the logs.

let redisFailureCount = 0
let hasWarnedRedisFailure = false

function logRedisFailure(op, err) {
  redisFailureCount++
  if (!hasWarnedRedisFailure) {
    console.warn(`[cache] Redis ${op} failed — falling back to in-memory: ${err.message}`)
    hasWarnedRedisFailure = true
  } else if (redisFailureCount % 100 === 0) {
    console.warn(`[cache] Redis still failing — ${redisFailureCount} command failures so far (latest: ${err.message})`)
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Read a cached value. Returns null on a genuine miss. Never throws.
 *
 * Falls through to the in-memory store even when redis.status === 'ready',
 * both on a clean Redis miss and on a Redis GET failure — because a prior
 * cacheSet() for this same key may itself have failed over to memory (see
 * cacheSet below). Without this fallthrough, that value would be
 * unreadable for its entire TTL: cacheGet would keep trying Redis (still
 * reporting "ready" — connection status, not per-command health) and
 * returning null, never checking the one place the value actually landed.
 * @param {string} key
 * @param {'default'|'overpass'} [pool] — which in-memory pool to fall back to
 *   if Redis is unavailable or fails; irrelevant when Redis is serving the
 *   request. Must match the pool the corresponding cacheSet() used.
 * @returns {Promise<object|null>}
 */
export async function cacheGet(key, pool = 'default') {
  if (redis?.status === 'ready') {
    try {
      const raw = await redis.get(key)
      if (raw) return JSON.parse(raw)
      return memGet(pool, key)
    } catch (err) {
      logRedisFailure('GET', err)
      return memGet(pool, key)
    }
  }
  return memGet(pool, key)
}

/**
 * Store a value in cache.
 * Errors are silently swallowed so cache failures never break requests —
 * they fail open to the in-memory store instead (throttled-logged, see
 * logRedisFailure above).
 * @param {string} key
 * @param {object} value  — must be JSON-serialisable
 * @param {number} [ttlMs] — defaults to the standard 3-minute diagnosis-cache TTL;
 *   callers with a different freshness requirement (e.g. the Overpass facility
 *   cache in routes/findDoctor.js) pass their own.
 * @param {'default'|'overpass'} [pool] — which in-memory pool this entry
 *   belongs to if Redis is unavailable or fails (see cacheGet above). Keeps
 *   this workload's writes from evicting a differently-lived workload's
 *   entries under the in-memory fallback.
 */
export async function cacheSet(key, value, ttlMs = CACHE_TTL_MS, pool = 'default') {
  if (redis?.status === 'ready') {
    try {
      await redis.set(key, JSON.stringify(value), 'PX', ttlMs)
    } catch (err) {
      logRedisFailure('SET', err)
      memSet(pool, key, value, ttlMs)
    }
    return
  }
  memSet(pool, key, value, ttlMs)
}

export { redis }
