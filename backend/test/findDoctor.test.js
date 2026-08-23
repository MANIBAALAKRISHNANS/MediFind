// Unit tests for routes/findDoctor.js's Overpass timeout/retry/cache logic.
// Exercises searchWithExpansion() directly against a mocked axios.post — no
// live server, Prisma, or real Overpass call involved. Run with:
//   node --test test/findDoctor.test.js
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'

import {
  searchWithExpansion,
  OVERPASS_TIMEOUT_MS,
  SEARCH_RADII_M,
  TIMEOUT_RETRY_RADIUS_M,
  TIMEOUT_RETRY_TIMEOUT_MS,
} from '../routes/findDoctor.js'
import { SERVER_SOCKET_TIMEOUT_MS } from '../config/timeouts.js'

// Coordinates are arbitrary — only freshCacheKeyPrefix() matters for test isolation.
const LAT = 13.0827
const LNG = 80.2707

let cacheKeyCounter = 0
/** A unique cache-key prefix per call, so every test gets a guaranteed miss
 * against utils/cache.js's real (module-singleton) in-memory store, instead
 * of needing to mock the cache module itself. */
function freshCacheKeyPrefix() {
  return `test:overpass:${Date.now()}:${cacheKeyCounter++}`
}

function timeoutError(timeoutMs) {
  const err = new Error(`timeout of ${timeoutMs}ms exceeded`)
  err.code = 'ECONNABORTED'
  return err
}

function overpassResponse(elements) {
  return { data: { elements } }
}

/** Pulls the `around:<radius>` value out of the Overpass QL body — axios.post's 2nd argument. */
function radiusFromCall(call) {
  const body = call.arguments[1]
  const match = body.match(/around:(\d+)/)
  return match ? Number(match[1]) : null
}

function timeoutFromCall(call) {
  return call.arguments[2]?.timeout
}

describe('findDoctor — Overpass timeout/retry', () => {
  test('on ECONNABORTED, retries with exactly the 3km/8s recovery parameters — not the widen ladder', async (t) => {
    const fakeElements = [
      { type: 'node', id: 1, lat: LAT, lon: LNG, tags: { name: 'Recovered Clinic', amenity: 'clinic' } },
    ]

    let callCount = 0
    t.mock.method(axios, 'post', async () => {
      callCount++
      if (callCount === 1) throw timeoutError(OVERPASS_TIMEOUT_MS)
      return overpassResponse(fakeElements)
    })

    const result = await searchWithExpansion(LAT, LNG, freshCacheKeyPrefix())

    assert.equal(axios.post.mock.calls.length, 2, 'expected exactly one retry (2 calls total)')

    const [firstCall, secondCall] = axios.post.mock.calls

    // First attempt: the normal first ladder tier, at the full primary timeout.
    assert.equal(radiusFromCall(firstCall), SEARCH_RADII_M[0])
    assert.equal(timeoutFromCall(firstCall), OVERPASS_TIMEOUT_MS)

    // Recovery attempt: exactly 3km / 8s — never one of the wider ladder tiers.
    assert.equal(radiusFromCall(secondCall), TIMEOUT_RETRY_RADIUS_M)
    assert.equal(timeoutFromCall(secondCall), TIMEOUT_RETRY_TIMEOUT_MS)
    assert.equal(TIMEOUT_RETRY_RADIUS_M, 3000, 'recovery radius must be 3km')
    assert.equal(TIMEOUT_RETRY_TIMEOUT_MS, 8000, 'recovery timeout must be 8s')
    assert.ok(
      !SEARCH_RADII_M.includes(TIMEOUT_RETRY_RADIUS_M),
      'recovery radius must not be one of the widen-ladder tiers',
    )

    assert.deepEqual(result, fakeElements)
  })

  test('makes exactly one retry attempt — even if the 3km recovery itself comes back empty, no wider tier is tried', async (t) => {
    let callCount = 0
    t.mock.method(axios, 'post', async () => {
      callCount++
      if (callCount === 1) throw timeoutError(OVERPASS_TIMEOUT_MS)
      return overpassResponse([]) // 3km recovery finds nothing
    })

    const result = await searchWithExpansion(LAT, LNG, freshCacheKeyPrefix())

    assert.equal(axios.post.mock.calls.length, 2, 'no 10/15/25km tier should be attempted after a timeout')
    assert.deepEqual(result, [], 'the empty recovery result is the final outcome, not a trigger to widen further')
  })

  test('if the 3km recovery ALSO times out, the error propagates and no third attempt is made', async (t) => {
    t.mock.method(axios, 'post', async () => { throw timeoutError(OVERPASS_TIMEOUT_MS) })

    await assert.rejects(
      () => searchWithExpansion(LAT, LNG, freshCacheKeyPrefix()),
      (err) => err.code === 'ECONNABORTED',
    )

    assert.equal(
      axios.post.mock.calls.length, 2,
      'expected exactly 2 calls total: the primary attempt + one recovery, then give up',
    )
  })

  test('contrast: a genuine zero-result response (no timeout) widens through the ladder normally, unlike a timeout', async (t) => {
    let callCount = 0
    t.mock.method(axios, 'post', async () => {
      callCount++
      if (callCount < 2) return overpassResponse([]) // 5km: confirmed empty, not a timeout
      return overpassResponse([
        { type: 'node', id: 2, lat: LAT, lon: LNG, tags: { name: 'Wide Area Hospital', amenity: 'hospital' } },
      ])
    })

    await searchWithExpansion(LAT, LNG, freshCacheKeyPrefix())

    assert.equal(axios.post.mock.calls.length, 2)
    assert.equal(radiusFromCall(axios.post.mock.calls[0]), SEARCH_RADII_M[0])
    assert.equal(
      radiusFromCall(axios.post.mock.calls[1]), SEARCH_RADII_M[1],
      'the zero-result case should widen to the NEXT ladder tier (10km) — never shrink to 3km',
    )
  })

  test('worst-case Overpass retry time stays under the backend socket timeout', () => {
    const worstCaseMs = OVERPASS_TIMEOUT_MS + TIMEOUT_RETRY_TIMEOUT_MS
    console.log(
      `[findDoctor.test] worst-case Overpass time = ${OVERPASS_TIMEOUT_MS}ms (primary) + ` +
      `${TIMEOUT_RETRY_TIMEOUT_MS}ms (recovery) = ${worstCaseMs}ms  vs.  ` +
      `server socket timeout = ${SERVER_SOCKET_TIMEOUT_MS}ms`,
    )
    assert.ok(
      worstCaseMs < SERVER_SOCKET_TIMEOUT_MS,
      `worst-case Overpass retry time (${worstCaseMs}ms) must stay under the server socket timeout ` +
      `(${SERVER_SOCKET_TIMEOUT_MS}ms), or the socket gets cut before a graceful JSON error response can be sent`,
    )
  })
})
