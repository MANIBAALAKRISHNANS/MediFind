import jwt from 'jsonwebtoken'

// Cookie name must match the name set in routes/auth.js
const COOKIE_NAME = 'mf_token'

/**
 * requireAuth reads the JWT from two locations in priority order:
 *
 *   1. HttpOnly cookie `mf_token`  — used by web browsers (XSS-safe)
 *   2. Authorization: Bearer <token> header — used by Capacitor Android/iOS,
 *      which manages cookies differently in a native WebView context.
 *
 * This dual-mode approach lets the web app benefit from HttpOnly cookie security
 * while keeping the mobile app working without cookie store changes.
 */
export function requireAuth(req, res, next) {
  // Priority 1: HttpOnly cookie (web)
  let token = req.cookies?.[COOKIE_NAME]

  // Priority 2: Bearer token header (Capacitor mobile)
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing or malformed authorization.', code: 'UNAUTHORIZED' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, email: payload.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.', code: 'UNAUTHORIZED' })
  }
}

export { COOKIE_NAME }
