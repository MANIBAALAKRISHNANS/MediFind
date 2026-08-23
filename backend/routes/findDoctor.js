import { Router } from 'express'
import axios from 'axios'
import Joi from 'joi'

import prisma from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { findBestMatch, normalizeSpecialty } from '../utils/ranking.js'
import { cacheGet, cacheSet } from '../utils/cache.js'
import { encodeGeohash } from '../utils/geohash.js'

const router = Router()

// ── Validation schema ─────────────────────────────────────────────────────────

const findDoctorSchema = Joi.object({
  lat:        Joi.number().min(-90).max(90).required(),
  lng:        Joi.number().min(-180).max(180).required(),
  specialty:  Joi.string().min(1).required(),
  analysisId: Joi.string().uuid().optional(),
})

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Dense Indian metro queries (our primary market) can legitimately take
// ~14-15s to compute on Overpass's public instance — measured directly
// against a 5km central-Chennai query. 15s gives that real-world case room
// to complete instead of getting cut off.
const OVERPASS_TIMEOUT_MS = 15_000

// Progressive search expansion — try a tight radius first, and only widen if
// a query genuinely comes back with zero results, so the common case
// (facilities nearby) stays fast.
const SEARCH_RADII_M = [5000, 10000, 15000, 25000]

// A TIMEOUT (as opposed to a clean zero-result response) means the area is
// too data-dense for Overpass to answer quickly at the current radius —
// widening further would only make it slower. So a timeout is handled by
// shrinking to this single smaller radius instead, with its own shorter
// budget (a 3km area should resolve fast; if it doesn't, further waiting
// isn't productive). This is tried at most once per request — whatever it
// returns (results, empty, or another failure) is the final outcome, and
// widening never resumes after a timeout.
const TIMEOUT_RETRY_RADIUS_M = 3000
const TIMEOUT_RETRY_TIMEOUT_MS = 8_000

// Round lat/lng into ~1km geohash cells and cache each radius tier's raw
// Overpass response for 20 minutes, so repeated searches in the same dense
// area (very common in a metro) don't re-hit Overpass at all.
const OVERPASS_CACHE_TTL_MS = 20 * 60 * 1000

function buildQuery(lat, lng, radius) {
  return (
    `[out:json][timeout:25];\n` +
    `(\n` +
    // amenity covers hospitals, clinics and doctors' offices; the separate
    // "healthcare" tag catches health centres and other facilities tagged
    // without a matching amenity value (e.g. standalone healthcare=centre).
    `  node["amenity"~"hospital|clinic|doctors"](around:${radius},${lat},${lng});\n` +
    `  way["amenity"~"hospital|clinic|doctors"](around:${radius},${lat},${lng});\n` +
    `  node["healthcare"](around:${radius},${lat},${lng});\n` +
    `  way["healthcare"](around:${radius},${lat},${lng});\n` +
    `);\n` +
    `out center tags;`
  )
}

function mapElement(el) {
  const tags = el.tags || {}
  return {
    // No display-string fallback here — a genuinely nameless facility must
    // stay null so ranking.js's "no name AND no address" disqualify rule can
    // see the true absence. Any display fallback happens after that check.
    name:         tags.name || tags['name:en'] || null,
    lat:          el.lat ?? el.center?.lat ?? null,
    lng:          el.lon ?? el.center?.lon ?? null,
    type:         tags.amenity || tags.healthcare || 'facility',
    phone:        tags.phone   || tags['contact:phone']   || null,
    website:      tags.website || tags['contact:website'] || null,
    address:      [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || null,
    openingHours: tags.opening_hours || null,
    speciality:   tags.healthcare_speciality || tags.speciality || null,
    osmId:        `${el.type}/${el.id}`,
  }
}

async function queryOverpass(lat, lng, radius, timeoutMs = OVERPASS_TIMEOUT_MS) {
  const response = await axios.post(OVERPASS_URL, buildQuery(lat, lng, radius), {
    headers: {
      'Content-Type': 'text/plain',
      'User-Agent':   'MediFind/1.0 (medifindofficial@gmail.com)',  // required by OSM policy
    },
    timeout: timeoutMs,
  })
  return response.data.elements ?? []
}

// Cache-aware wrapper around queryOverpass — checks the geohash-bucketed
// cache first, and on a miss, stores the (possibly empty) result for 20
// minutes. Only successful queries are cached; a timeout or error propagates
// so the caller's own retry/error handling still runs.
async function fetchFacilities(lat, lng, radius, cacheKeyPrefix, timeoutMs) {
  const cacheKey = `${cacheKeyPrefix}:${radius}`
  const cached = await cacheGet(cacheKey, 'overpass')
  if (cached) return cached

  const elements = await queryOverpass(lat, lng, radius, timeoutMs)
  await cacheSet(cacheKey, elements, OVERPASS_CACHE_TTL_MS, 'overpass')
  return elements
}

/**
 * Progressive-expansion search with timeout-aware fallback:
 *   - A tier that comes back with zero results (successfully) widens to the
 *     next radius — the normal "look further" case.
 *   - A tier that TIMES OUT abandons widening entirely and retries once at a
 *     smaller, faster radius; whatever that returns (or throws) is final.
 */
async function searchWithExpansion(lat, lng, cacheKeyPrefix) {
  for (const radius of SEARCH_RADII_M) {
    try {
      const elements = await fetchFacilities(lat, lng, radius, cacheKeyPrefix, OVERPASS_TIMEOUT_MS)
      if (elements.length > 0) return elements
      // Confirmed empty at this radius — widen and keep looking.
    } catch (err) {
      if (err.code !== 'ECONNABORTED') throw err
      return await fetchFacilities(lat, lng, TIMEOUT_RETRY_RADIUS_M, cacheKeyPrefix, TIMEOUT_RETRY_TIMEOUT_MS)
    }
  }
  return []
}

// Exported for backend/test/findDoctor.test.js — the retry/timeout/cache
// logic above is unit-tested directly against a mocked axios.post rather
// than through a live HTTP server + real Prisma/Overpass.
export {
  searchWithExpansion,
  fetchFacilities,
  queryOverpass,
  OVERPASS_TIMEOUT_MS,
  SEARCH_RADII_M,
  TIMEOUT_RETRY_RADIUS_M,
  TIMEOUT_RETRY_TIMEOUT_MS,
}

// ── POST /api/find-doctor (protected) ────────────────────────────────────────

router.post('/', requireAuth, validate(findDoctorSchema), async (req, res, next) => {
  const { lat, lng, specialty, analysisId } = req.body

  const trimmedSpecialty = specialty.trim()

  // Cache key: a ~1km geohash cell + the canonical specialty (falling back to
  // the raw lowercased string for a specialty normalizeSpecialty doesn't
  // recognize, e.g. a genuinely novel one) — so repeat searches for the same
  // specialty in the same dense area reuse the cached Overpass response
  // instead of re-querying.
  const geohash = encodeGeohash(lat, lng, 6)
  const specialtyCacheKey = normalizeSpecialty(trimmedSpecialty) ?? trimmedSpecialty.toLowerCase()
  const cacheKeyPrefix = `overpass:v1:${geohash}:${specialtyCacheKey}`

  // ── Step 1: Query Overpass, expanding the radius until something turns up ──
  let elements = []
  try {
    elements = await searchWithExpansion(lat, lng, cacheKeyPrefix)
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'The map service took too long to respond. Please try again in a moment.',
        code:  'OVERPASS_TIMEOUT',
      })
    }
    if (err.response) {
      // Overpass responds with 429 when rate-limited, 504/503 when overloaded.
      if (err.response.status === 429) {
        return res.status(503).json({
          error: 'The map service is rate-limited right now. Please try again in a minute.',
          code:  'OVERPASS_RATE_LIMITED',
        })
      }
      return res.status(503).json({
        error: 'The map service returned an error. Please try again shortly.',
        code:  'OVERPASS_ERROR',
      })
    }
    if (err.request) {
      // Request was made but no response arrived — network/DNS failure, not down to the client.
      return res.status(503).json({
        error: 'Could not reach the map service. Please check your connection and try again.',
        code:  'OVERPASS_UNAVAILABLE',
      })
    }
    return next(err)
  }

  if (elements.length === 0) {
    return res.status(404).json({
      error: 'No nearby facilities found. Try entering a different location or searching for a broader specialty.',
      code:  'NO_RESULTS',
    })
  }

  const facilities = elements.map(mapElement).filter((f) => f.lat != null && f.lng != null)

  if (facilities.length === 0) {
    return res.status(404).json({
      error: 'No nearby facilities found. Try entering a different location or searching for a broader specialty.',
      code:  'NO_RESULTS',
    })
  }

  const { bestMatch, note, facilities: nearbyFacilities } = findBestMatch(facilities, trimmedSpecialty, lat, lng)

  if (!bestMatch) {
    return res.status(404).json({
      error: 'No nearby facilities found. Try entering a different location or searching for a broader specialty.',
      code:  'NO_RESULTS',
    })
  }

  // ── Step 2: Persist match onto the analysis row (optional) ────────────────
  if (analysisId && bestMatch) {
    try {
      await prisma.analysis.updateMany({
        where: { id: analysisId, userId: req.user.id },
        data: {
          matchName:       bestMatch.name,
          matchAddress:    bestMatch.address,
          matchPhone:      bestMatch.phone,
          matchWebsite:    bestMatch.website,
          matchType:       bestMatch.type,
          matchDistanceKm: bestMatch.distanceKm,
          matchLat:        bestMatch.lat,
          matchLng:        bestMatch.lng,
          matchOsmMapUrl:         bestMatch.osmMapUrl,
          matchDirectionsUrl:     bestMatch.directionsUrl,
          matchScore:             bestMatch.matchScore,
          matchSpecialtyScore:    bestMatch.scoreBreakdown?.specialtyScore    ?? null,
          matchDistanceScore:     bestMatch.scoreBreakdown?.distanceScore     ?? null,
          matchTypeScore:         bestMatch.scoreBreakdown?.typeScore         ?? null,
          matchCompletenessScore: bestMatch.scoreBreakdown?.completenessScore ?? null,
          locationLat:            lat,
          locationLng:            lng,
        },
      })
    } catch {
      // Non-fatal — doctor search result is still returned even if DB update fails
    }
  }

  res.json({
    bestMatch,
    note,
    facilities: nearbyFacilities,   // populated only when `note` is set (no exact specialty match)
    alternativesCount: facilities.length - 1,
    source: 'OpenStreetMap',
  })
})

export default router
