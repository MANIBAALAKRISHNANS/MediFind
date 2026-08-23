import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { getCurrentLocation, clearLocationCache } from '../services/locationService.js'

describe('locationService.getCurrentLocation', () => {
  const originalGeolocation = navigator.geolocation

  beforeEach(() => {
    clearLocationCache()
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', { value: originalGeolocation, configurable: true })
    vi.restoreAllMocks()
  })

  it('resolves lat/lng/accuracy from navigator.geolocation.getCurrentPosition on success', async () => {
    const getCurrentPosition = vi.fn((success) => {
      success({ coords: { latitude: 13.0827, longitude: 80.2707, accuracy: 25 } })
    })
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition },
      configurable: true,
    })

    const result = await getCurrentLocation()

    expect(result).toEqual({ lat: 13.0827, lng: 80.2707, accuracy: 25, source: 'gps' })
    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('rejects with a clear message when permission is denied and IP fallback also fails', async () => {
    const getCurrentPosition = vi.fn((_success, error) => {
      error({ code: 1 }) // PERMISSION_DENIED
    })
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition },
      configurable: true,
    })
    // Force the IP fallback (fetch) to fail too, so the permission-denied
    // message is the one that actually surfaces.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    await expect(getCurrentLocation()).rejects.toThrow(/location permission denied/i)

    vi.unstubAllGlobals()
  })

  it('caches a successful GPS result for subsequent calls (getCurrentPosition called only once)', async () => {
    const getCurrentPosition = vi.fn((success) => {
      success({ coords: { latitude: 1, longitude: 2, accuracy: 10 } })
    })
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition },
      configurable: true,
    })

    await getCurrentLocation()
    await getCurrentLocation()

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
  })
})
