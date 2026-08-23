// The Express app itself — middleware, routes, error handling. Deliberately
// has NO app.listen() and NO startup side effects (env-var fatal checks, the
// Postgres connectivity probe) so it can be imported directly by tests via
// supertest without binding a port or exiting the process. server.js is the
// real entrypoint: it does those startup checks, imports this app, and calls
// listen().
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'

import { redis } from './utils/cache.js'
import healthRouter     from './routes/health.js'
import analyzeRouter    from './routes/analyze.js'
import findDoctorRouter from './routes/findDoctor.js'
import authRouter       from './routes/auth.js'
import historyRouter    from './routes/history.js'

// CORS — supports comma-separated CORS_ORIGIN list for web + Capacitor mobile.
// origin: true (dev fallback) reflects any origin — compatible with credentials:true.
// In production set CORS_ORIGIN to a comma-separated list, e.g.:
//   CORS_ORIGIN=https://localhost,https://medifind.onrender.com
// Capacitor Android uses https://localhost when androidScheme is "https".
function buildCorsOrigin(env) {
  if (!env) return true   // dev: reflect any origin
  const allowed = new Set(env.split(',').map(s => s.trim()).filter(Boolean))
  if (process.env.NODE_ENV === 'production') {
    console.log(`[cors] Allowed origins: ${[...allowed].join(', ')}`)
  }
  return (origin, cb) => {
    // Requests with no origin header (curl, same-origin, mobile native) are always ok
    if (!origin || allowed.has(origin)) return cb(null, true)

    // In development, dynamically allow any localhost origin to prevent port mismatch errors
    if (process.env.NODE_ENV !== 'production') {
      try {
        const url = new URL(origin)
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          return cb(null, true)
        }
      } catch (e) {
        // ignore invalid origin URLs
      }
    }

    cb(Object.assign(new Error(`CORS: origin not allowed — ${origin}`), { status: 403 }))
  }
}

export function createApp() {
  const app = express()

  app.use(helmet())

  const corsOptions = {
    origin:         buildCorsOrigin(process.env.CORS_ORIGIN),
    methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials:    true,   // required for HttpOnly cookies + Android Bearer token
  }
  app.use(cors(corsOptions))
  app.options('*', cors(corsOptions))   // handle pre-flight on all routes

  app.use(cookieParser())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))

  // Rate limiter — uses Redis store when Redis is available so the limit is shared
  // across all server instances; falls back to in-memory store (single-instance only).
  const rateLimitStore = redis?.status === 'ready'
    ? new RedisStore({ sendCommand: (...args) => redis.call(...args) })
    : undefined

  const limiter = rateLimit({
    windowMs:       60 * 1000,
    max:            100,
    standardHeaders: true,
    legacyHeaders:  false,
    store:          rateLimitStore,
    message:        { error: 'Too many requests — try again in a minute.', code: 'RATE_LIMITED' },
  })
  app.use('/api/', limiter)

  // ── Routes ──────────────────────────────────────────────────────────────
  app.use('/api/health',      healthRouter)
  app.use('/api/auth',        authRouter)
  app.use('/api/analyze',     analyzeRouter)
  app.use('/api/find-doctor', findDoctorRouter)
  app.use('/api/history',     historyRouter)

  // ── GET /reset-password — serves HTML page for mobile email links ───────
  // NOTE: helmet's default CSP blocks inline <script> tags with "script-src 'self'".
  // We override the CSP for this route only so that doReset() can execute in the browser.
  app.get('/reset-password', (req, res) => {
    // Sanitize: token is hex only, email stripped of dangerous chars
    const token = (req.query.token || '').replace(/[^a-f0-9]/gi, '')
    const email = (req.query.email || '').replace(/['"\<\>\\]/g, '')
    res.setHeader('Content-Type', 'text/html')
    // Allow inline scripts & styles for this page only (reset form logic lives inline)
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; form-action 'self'; connect-src 'self'"
    )
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Reset Password · MediFind</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;background:#f0fdf4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
    .card{background:#fff;border-radius:16px;padding:32px;width:100%;max-width:420px;box-shadow:0 4px 24px rgba(0,0,0,.08)}
    h2{color:#0d9488;font-size:20px;margin-bottom:4px}
    .sub{color:#6b7280;font-size:13px;margin-bottom:24px}
    label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;margin-top:12px}
    input{width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-size:15px;outline:none}
    input:focus{border-color:#0d9488;box-shadow:0 0 0 3px rgba(13,148,136,.15)}
    #btn{width:100%;margin-top:20px;padding:14px;background:#0d9488;color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s}
    #btn:hover{background:#0f766e}
    #btn:disabled{background:#9ca3af;cursor:not-allowed}
    #msg{margin-top:16px;padding:14px;border-radius:8px;font-size:14px;text-align:center;font-weight:500;display:none}
    .ok{background:#d1fae5;color:#065f46;border:1px solid #6ee7b7}
    .er{background:#fee2e2;color:#991b1b;border:1px solid #fca5a5}
  </style>
</head>
<body>
  <div class="card">
    <h2>🏥 MediFind</h2>
    <p class="sub">Enter your new password. Link expires in 1 hour.</p>
    <label>New Password</label>
    <input type="password" id="pw" placeholder="Min 8 chars, include a number"/>
    <label>Confirm Password</label>
    <input type="password" id="pw2" placeholder="Repeat new password"/>
    <button id="btn" type="button" onclick="doReset()">Reset Password</button>
    <div id="msg"></div>
  </div>
  <script>
    const urlParams = new URLSearchParams(window.location.search);
    const TOKEN = (urlParams.get('token') || '').replace(/[^a-f0-9]/gi, '').trim();
    const EMAIL = (urlParams.get('email') || '').replace(/['"<>\\]/g, '').replace(/[║\s]/g, '').trim();

    function showMsg(text, isOk) {
      var el = document.getElementById('msg');
      el.textContent = text;
      el.className = isOk ? 'ok' : 'er';
      el.style.display = 'block';
    }

    async function doReset() {
      var pw  = document.getElementById('pw').value;
      var pw2 = document.getElementById('pw2').value;
      var btn = document.getElementById('btn');

      if (pw.length < 8)           { showMsg('Password must be at least 8 characters.', false); return; }
      if (pw !== pw2)              { showMsg('Passwords do not match.', false); return; }
      if (!/[a-zA-Z]/.test(pw))   { showMsg('Password must contain at least one letter.', false); return; }
      if (!/[0-9]/.test(pw))      { showMsg('Password must contain at least one number.', false); return; }

      btn.disabled = true;
      btn.textContent = 'Resetting…';

      try {
        var resp = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: EMAIL, token: TOKEN, newPassword: pw })
        });
        var data = await resp.json();
        if (resp.ok) {
          document.getElementById('pw').style.display  = 'none';
          document.getElementById('pw2').style.display = 'none';
          document.querySelectorAll('label').forEach(function(l){ l.style.display='none'; });
          btn.style.display = 'none';
          showMsg('✅ Password reset successfully! You can now sign in on the MediFind app.', true);
        } else {
          showMsg(data.error || 'Something went wrong. Please try again.', false);
          btn.disabled = false;
          btn.textContent = 'Reset Password';
        }
      } catch(e) {
        showMsg('Connection failed. Make sure the backend server is running.', false);
        btn.disabled = false;
        btn.textContent = 'Reset Password';
      }
    }
  </script>
</body>
</html>`)
  })

  // ── 404 ─────────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found.', code: 'NOT_FOUND' })
  })

  // ── Global error handler ───────────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const status = err.status ?? err.statusCode ?? 500
    const msg    = err.message ?? 'Internal server error.'
    const code   = err.code    ?? 'INTERNAL_ERROR'

    if (status >= 500) {
      console.error('[error]', err)
    }

    res.status(status).json({ error: msg, code })
  })

  return app
}

export default createApp()
