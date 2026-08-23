import client from '../api/client.js'

// Nominatim base — kept here so it can be overridden via env if needed
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

/**
 * Analyze symptoms with Gemini AI.
 * Returns the diagnosis plus the persisted analysisId.
 * @returns {{ disease, specialty, severity, urgency, description, recommendations, redFlags, analysisId }}
 */
export async function analyzeSymptoms(symptoms) {
  const res = await client.post('/api/analyze', { symptoms })
  return res.data
}

/**
 * Find the best matching medical facility near the given coordinates.
 * Optionally links the result to an existing analysis record in the DB.
 * `note` + `facilities` are only populated when no facility matched the
 * requested specialty — `bestMatch` is then the closest nearby facility.
 * @returns {{ bestMatch, note: string|null, facilities: object[]|null, alternativesCount, source }}
 */
export async function findBestDoctor(lat, lng, specialty, analysisId) {
  const res = await client.post('/api/find-doctor', { lat, lng, specialty, analysisId })
  return res.data
}

/**
 * Convert a city name to lat/lng using Nominatim (OpenStreetMap geocoder).
 * Uses the same axios instance so timeout, error normalisation, and user-agent
 * headers are applied consistently across the entire service layer.
 * @returns {{ lat, lng, displayName, source: 'city-search' }}
 */
export async function geocodeCity(cityName) {
  const res = await client.get(`${NOMINATIM_BASE}/search`, {
    params: { q: cityName, format: 'json', limit: 1 },
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'MediFind/1.0 (medifindofficial@gmail.com)',
    },
  })

  const data = res.data
  if (!data || data.length === 0) {
    throw new Error(`City "${cityName}" not found. Please check the spelling or try a nearby larger city.`)
  }

  return {
    lat:         parseFloat(data[0].lat),
    lng:         parseFloat(data[0].lon),
    displayName: data[0].display_name,
    source:      'city-search',
  }
}
