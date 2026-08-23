// ── Session-level GPS cache — avoids re-acquiring for same session ─────────────
// Cached for 5 minutes; user can clear by clicking "Try Again".
const GPS_CACHE_TTL = 5 * 60 * 1000
let _gpsCache = null // { coords, expiresAt }

export function clearLocationCache() {
  _gpsCache = null
}

// ── Main entry point ──────────────────────────────────────────────────────────
export async function getCurrentLocation() {
  if (_gpsCache && Date.now() < _gpsCache.expiresAt) {
    return _gpsCache.coords
  }

  const coords = await getBrowserLocation()

  if (coords.source === 'gps') {
    _gpsCache = { coords, expiresAt: Date.now() + GPS_CACHE_TTL }
  }
  return coords
}

// ── Browser GPS ───────────────────────────────────────────────────────────────
function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      getIpLocation().then(resolve).catch(reject)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat:      position.coords.latitude,
          lng:      position.coords.longitude,
          accuracy: position.coords.accuracy,
          source:   'gps',
        })
      },
      async (err) => {
        if (err.code === 1) {
          try { resolve(await getIpLocation()) }
          catch {
            reject(new Error(
              'Location permission denied. Click the 🔒 lock icon in your browser address bar → ' +
              'Site settings → set Location to Allow, then try again.'
            ))
          }
          return
        }
        if (err.code === 2) {
          reject(new Error('Location unavailable. Make sure GPS or location services are enabled on your device.'))
          return
        }
        if (err.code === 3) {
          try { resolve(await getIpLocation()) }
          catch { reject(new Error('Location request timed out. Please try again.')) }
          return
        }
        reject(new Error('Could not get your location. Please try again.'))
      },
      // maximumAge: 5 min — reuse a recent GPS fix instead of cold-acquiring every time
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5 * 60 * 1000 },
    )
  })
}

// ── IP-based fallback ─────────────────────────────────────────────────────────
// Cached per session — IP doesn't change while the tab is open.
let _ipCache = null

async function getIpLocation() {
  if (_ipCache) return _ipCache

  const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error('IP location service unavailable')
  const data = await response.json()
  if (!data.latitude || !data.longitude) throw new Error('IP location returned no coordinates')

  _ipCache = {
    lat:      parseFloat(data.latitude),
    lng:      parseFloat(data.longitude),
    accuracy: 5000,
    source:   'ip-fallback',
    city:     data.city ?? null,
  }
  return _ipCache
}
