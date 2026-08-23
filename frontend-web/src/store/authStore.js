import { create } from 'zustand'
import * as authService from '../services/authService.js'
import { getToken, setToken, clearToken } from '../api/client.js'

const useAuthStore = create((set, get) => ({
  user:          null,
  token:         null, // populated by loadUser() on mount
  isLoading:     false,
  isInitialized: false,

  // ── Primitives ──────────────────────────────────────────────────────────────
  setAuth(user, token) {
    setToken(token)   // updates both localStorage and the in-memory cache in client.js
    set({ user, token })
  },

  clearAuth() {
    clearToken()      // clears both localStorage and the in-memory cache
    set({ user: null, token: null })
  },

  // ── Auth actions ────────────────────────────────────────────────────────────
  // The try/catch blocks below only set isLoading; errors propagate to callers.

  async login(email, password) {
    set({ isLoading: true })
    try {
      const data = await authService.login(email, password)
      get().setAuth(data.user, data.token)
      return true
    } finally {
      set({ isLoading: false })
    }
  },

  async signup(name, email, password) {
    set({ isLoading: true })
    try {
      const data = await authService.signup(name, email, password)
      get().setAuth(data.user, data.token)
      return true
    } finally {
      set({ isLoading: false })
    }
  },

  async forgotPassword(email) {
    return authService.forgotPassword(email)
  },

  async resetPassword(email, token, newPassword) {
    return authService.resetPassword(email, token, newPassword)
  },

  async updateProfile(name, email) {
    set({ isLoading: true })
    try {
      const updatedUser = await authService.updateProfile(name, email)
      const { token } = get()
      get().setAuth(updatedUser, token)
      return updatedUser
    } finally {
      set({ isLoading: false })
    }
  },

  async logout() {
    try {
      // Ask the server to clear the HttpOnly cookie; ignore network failures
      await authService.logout()
    } catch { /* ignore */ } finally {
      get().clearAuth()
    }
  },

  // ── Bootstrap — call once on app mount ─────────────────────────────────────
  async loadUser() {
    // client.js reads localStorage once at import time; use its cache as source of truth.
    const token = getToken()
    if (token) {
      set({ token })
      try {
        const user = await authService.getCurrentUser()
        get().setAuth(user, token)
      } catch {
        get().clearAuth()
      }
    }
    set({ isInitialized: true })
  },
}))

export default useAuthStore
