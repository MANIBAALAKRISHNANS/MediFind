import client from '../api/client.js'

/**
 * Register a new account.
 * @returns {{ user, token }}
 */
export async function signup(name, email, password) {
  const res = await client.post('/api/auth/signup', { name, email, password })
  return res.data // { user, token }
}

/**
 * Sign in with email + password.
 * @returns {{ user, token }}
 */
export async function login(email, password) {
  const res = await client.post('/api/auth/login', { email, password })
  return res.data // { user, token }
}

/**
 * Trigger a password-reset email.
 * Always returns a message (never reveals whether email exists).
 * @returns {{ message }}
 */
export async function forgotPassword(email) {
  const res = await client.post('/api/auth/forgot-password', { email })
  return res.data // { message }
}

/**
 * Complete password reset with the token from the email link. The token
 * proves ownership of the email — the backend rejects the request without it.
 * @returns {{ message }}
 */
export async function resetPassword(email, token, newPassword) {
  const res = await client.post('/api/auth/reset-password', { email, token, newPassword })
  return res.data // { message }
}

/**
 * Fetch the currently authenticated user (requires valid token).
 * @returns {object} safeUser object
 */
export async function getCurrentUser() {
  const res = await client.get('/api/auth/me')
  return res.data // safeUser (no password / resetToken fields)
}

/**
 * Update the current user's name and/or email.
 * @returns {object} updated safeUser
 */
export async function updateProfile(name, email) {
  const res = await client.put('/api/auth/profile', { name, email })
  return res.data // updated safeUser
}

/**
 * Sign out — tells the server to clear the HttpOnly cookie.
 */
export async function logout() {
  await client.post('/api/auth/logout')
}
