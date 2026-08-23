import { setDefaultResultOrder } from 'dns'
// Node 18+ changed the default DNS order to 'verbatim' (IPv6 first).
// Our network has no IPv6 connectivity, so force IPv4 for all outbound connections
// (fixes ENETUNREACH on smtp.gmail.com and similar dual-stack hostnames).
setDefaultResultOrder('ipv4first')

import 'dotenv/config'

import prisma from './db.js'
import { SERVER_SOCKET_TIMEOUT_MS } from './config/timeouts.js'
import { createApp } from './app.js'

// ── Startup: validate critical env vars ──────────────────────────────────────
// Fail loud at boot rather than silently at request time.

const _jwtSecret  = process.env.JWT_SECRET

if (!_jwtSecret || _jwtSecret.length < 32) {
  console.error(
    '\n' +
    '╔══════════════════════════════════════════════════════════════════╗\n' +
    '║  🚨  FATAL CONFIG ERROR                                          ║\n' +
    '║  JWT_SECRET is MISSING or too short (< 32 chars).               ║\n' +
    '║  All authenticated endpoints will fail or be insecure.          ║\n' +
    '║  → Generate one: node -e "require(\'crypto\').randomBytes(32)      ║\n' +
    '║    .toString(\'hex\')" and add it to your .env.                   ║\n' +
    '╚══════════════════════════════════════════════════════════════════╝\n'
  )
  process.exit(1)
}

if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
  console.error(
    '\n' +
    '╔══════════════════════════════════════════════════════════════════╗\n' +
    '║  🚨  FATAL CONFIG ERROR                                          ║\n' +
    '║  CORS_ORIGIN is not set in production.                          ║\n' +
    '║  Without it the server reflects ANY origin back with             ║\n' +
    '║  credentials:true, which lets any website make authenticated     ║\n' +
    '║  requests on behalf of a logged-in user.                        ║\n' +
    '║  → Set CORS_ORIGIN to a comma-separated allow-list, e.g.:        ║\n' +
    '║    CORS_ORIGIN=https://medifind.example.com                     ║\n' +
    '╚══════════════════════════════════════════════════════════════════╝\n'
  )
  process.exit(1)
}

if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
  console.warn('⚠️  WARNING: REDIS_URL not set. Rate limiting, diagnosis cache, and the Overpass facility cache are per-instance only (sharing one small in-memory pool). This will break with horizontal scaling.')
}

// ── App ───────────────────────────────────────────────────────────────────────
// All middleware, routes, and error handling live in app.js so tests can
// import the app directly (via supertest) without this file's startup side
// effects (env checks below, the Postgres probe, app.listen).

const app = createApp()
const PORT = process.env.PORT ?? 5000

// ── Start ─────────────────────────────────────────────────────────────────────

try {
  await prisma.$queryRaw`SELECT 1`
  console.log('✅ Postgres connected via Prisma')
} catch (err) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Database connection failed:', err.message)
    process.exit(1)
  } else {
    console.warn(
      '\n' +
      '╔══════════════════════════════════════════════════════════════════╗\n' +
      '║  ⚠️  DATABASE WARNING                                           ║\n' +
      '║  PostgreSQL connection failed — DB features will be unavailable.║\n' +
      '║  The frontend and non-DB endpoints will still work.            ║\n' +
      '║  To fix: set DATABASE_URL in backend/.env to a valid           ║\n' +
      '║  PostgreSQL connection string.                                 ║\n' +
      '║  Free options: https://neon.tech or https://supabase.com       ║\n' +
      '╚══════════════════════════════════════════════════════════════════╝\n'
    )
  }
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MediFind API  →  http://localhost:${PORT}`)
})

// Ensure the server always responds before the frontend 30s axios timeout
// drops the socket connection (which shows "socket closed unexpectedly").
server.timeout = SERVER_SOCKET_TIMEOUT_MS
server.keepAliveTimeout = 5_000

// ── Graceful shutdown ─────────────────────────────────────────────────────────

process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully…')
  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
})
