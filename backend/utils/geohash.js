// Minimal standard geohash encoder — no dependency needed for what
// routes/findDoctor.js uses it for (a cache-bucketing key, not a spatial
// index). Precision 6 yields ~1.2km × 0.6km cells, close enough to the
// "~1km precision" the Overpass result cache is specced against.
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'

/**
 * @param {number} lat
 * @param {number} lng
 * @param {number} [precision=6]
 * @returns {string} the geohash, e.g. "tdr1vg"
 */
export function encodeGeohash(lat, lng, precision = 6) {
  let latMin = -90, latMax = 90
  let lngMin = -180, lngMax = 180
  let isEvenBit = true
  let bit = 0
  let charIdx = 0
  let geohash = ''

  while (geohash.length < precision) {
    if (isEvenBit) {
      const mid = (lngMin + lngMax) / 2
      if (lng >= mid) { charIdx = charIdx * 2 + 1; lngMin = mid } else { charIdx = charIdx * 2; lngMax = mid }
    } else {
      const mid = (latMin + latMax) / 2
      if (lat >= mid) { charIdx = charIdx * 2 + 1; latMin = mid } else { charIdx = charIdx * 2; latMax = mid }
    }
    isEvenBit = !isEvenBit

    if (++bit === 5) {
      geohash += BASE32[charIdx]
      bit = 0
      charIdx = 0
    }
  }

  return geohash
}

export default encodeGeohash
