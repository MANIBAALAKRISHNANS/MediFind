// MediFind Service Worker
// Strategy:
//   API calls  → network-first, JSON offline fallback
//   Static assets (JS/CSS/fonts/images) → cache-first, fetch & cache on miss
//   Navigation (HTML) → network-first, cached shell fallback

const CACHE = 'medifind-v1'

// Resources to pre-cache on install
const PRECACHE = ['/']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // ── API calls: network-first, offline JSON fallback ──────────────────────
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: 'You are offline. Please check your connection.', code: 'OFFLINE' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    )
    return
  }

  // ── Fonts from Google: cache-first (they never change) ───────────────────
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(request, clone))
          }
          return res
        })
      })
    )
    return
  }

  // ── Navigation requests: network-first, fall back to cached / ────────────
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(request, clone))
          }
          return res
        })
        .catch(() => caches.match('/').then((cached) => cached || fetch(request)))
    )
    return
  }

  // ── Static assets: cache-first, update in background ────────────────────
  e.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((res) => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(request, clone))
        }
        return res
      })
      return cached || networkFetch
    })
  )
})
