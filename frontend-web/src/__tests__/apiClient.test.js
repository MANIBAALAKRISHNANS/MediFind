import { describe, it, expect, beforeEach } from 'vitest'

import client, { setToken, clearToken, getToken } from '../api/client.js'

// Custom axios adapter — captures the fully-resolved request config (headers
// included, after all interceptors have run) instead of making a real network
// call, so we can assert on exactly what would have been sent.
function captureAdapter(capturedConfigs) {
  return async (config) => {
    capturedConfigs.push(config)
    return {
      data: {}, status: 200, statusText: 'OK', headers: {}, config,
    }
  }
}

describe('api client — auth token attachment', () => {
  let captured

  beforeEach(() => {
    captured = []
    client.defaults.adapter = captureAdapter(captured)
    clearToken()
  })

  it('does NOT attach an Authorization header when no token is set', async () => {
    await client.get('/api/health')

    expect(captured).toHaveLength(1)
    expect(captured[0].headers.Authorization).toBeUndefined()
  })

  it('attaches "Authorization: Bearer <token>" to every request once a token is set', async () => {
    setToken('abc123.jwt.token')

    await client.get('/api/history')

    expect(captured).toHaveLength(1)
    expect(captured[0].headers.Authorization).toBe('Bearer abc123.jwt.token')
  })

  it('setToken persists to localStorage and getToken reflects it', () => {
    setToken('persisted-token')
    expect(getToken()).toBe('persisted-token')
    expect(localStorage.getItem('medifind_token')).toBe('persisted-token')
  })

  it('clearToken removes the token from both memory and localStorage, and stops attaching the header', async () => {
    setToken('to-be-cleared')
    clearToken()

    expect(getToken()).toBeNull()
    expect(localStorage.getItem('medifind_token')).toBeNull()

    await client.get('/api/health')
    expect(captured[0].headers.Authorization).toBeUndefined()
  })
})
