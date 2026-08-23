import axios from 'axios'

import { TOKEN_KEY } from '../constants.js'

// ── Base URL resolution (web only) ─────────────────────────────────────────────
// 1. VITE_API_URL — explicit override, e.g. for staging builds
// 2. Dev server    — Vite proxies /api → localhost:5000, so hitting the backend
//                     directly avoids relying on the proxy being configured
// 3. Production     — '/api' assumes the web app is served behind a reverse
//                     proxy (e.g. Nginx) that forwards /api to the backend
function getBaseURL() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  return import.meta.env.DEV ? 'http://localhost:5000' : '/api'
}

const client = axios.create({
  baseURL:         getBaseURL(),
  timeout:         30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

// ── Token memory cache — read localStorage once, not on every request ─────────
// Updated by setToken/clearToken so auth changes propagate without extra I/O.
let _cachedToken = localStorage.getItem(TOKEN_KEY)

export function getToken() { return _cachedToken }

export function setToken(token) {
  _cachedToken = token
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else        localStorage.removeItem(TOKEN_KEY)
}

export function clearToken() {
  _cachedToken = null
  localStorage.removeItem(TOKEN_KEY)
}

// ── Request interceptor — attach Bearer token ─────────────────────────────────
client.interceptors.request.use(
  (config) => {
    if (_cachedToken) config.headers.Authorization = `Bearer ${_cachedToken}`
    return config
  },
  (error) => Promise.reject(normalizeError(error)),
)

// ── Response interceptor — handle 401 globally ────────────────────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url    = error.config?.url ?? ''

    if (status === 401 && !url.includes('/api/auth/')) {
      clearToken()
      window.location.href = '/login'
    }

    return Promise.reject(normalizeError(error))
  },
)

function normalizeError(error) {
  if (error.response) {
    const data       = error.response.data ?? {}
    const normalized = new Error(data.error ?? `Request failed with status ${error.response.status}`)
    normalized.code   = data.code ?? 'REQUEST_ERROR'
    normalized.status = error.response.status
    normalized.data   = data
    return normalized
  }

  if (
    error.request ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    error.message?.toLowerCase().includes('socket') ||
    error.message?.toLowerCase().includes('network')
  ) {
    const normalized = new Error('Unable to connect to the server. Please check your internet connection and try again.')
    normalized.code  = 'NETWORK_ERROR'
    return normalized
  }

  const normalized = new Error(
    'Something went wrong. Please try again. If the problem persists, contact medifindofficial@gmail.com',
  )
  normalized.code = 'UNKNOWN_ERROR'
  return normalized
}

export default client
