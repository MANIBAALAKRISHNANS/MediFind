#!/usr/bin/env node
// scripts/load-test.js — the "load-tests" CI job.
// Fires concurrent POST /api/analyze requests at a running backend and
// checks: no 500s, avg response time is fast (pure local rule-engine, no
// external calls), and the global rate limiter (backend/app.js: 100
// req/min per IP across all /api/ routes) genuinely engages under load.
//
// Usage: BASE_URL=http://localhost:5000 node scripts/load-test.js
import { randomUUID } from 'crypto'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'
const AVG_RESPONSE_TIME_BUDGET_MS = 2000

const SYMPTOM_PHRASES = [
  'fever and headache for two days', 'sore throat with mild cough',
  'stomach pain after eating spicy food', 'joint pain in both knees',
  'skin rash with itching on my arm', 'dizziness after standing up quickly',
  'burning urination for one day', 'mild chest tightness after exercise',
  'runny nose and sneezing', 'lower back pain from sitting all day',
]

async function timedRequest(url, options) {
  const start = performance.now()
  let status = null
  try {
    const res = await fetch(url, options)
    status = res.status
    await res.json().catch(() => null)
  } catch (err) {
    status = 'NETWORK_ERROR'
  }
  return { status, ms: performance.now() - start }
}

async function signUpThrowawayUser() {
  const email = `loadtest-${Date.now()}-${randomUUID()}@example.com`
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Load Test User', email, password: 'testpass123' }),
  })
  if (!res.ok) throw new Error(`Could not create a load-test user: ${res.status} ${await res.text()}`)
  const { token } = await res.json()
  return { token, email }
}

async function fireBurst(token, count) {
  const requests = Array.from({ length: count }, (_, i) =>
    timedRequest(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ symptoms: SYMPTOM_PHRASES[i % SYMPTOM_PHRASES.length] + ` (${i})` }),
    })
  )
  return Promise.all(requests)
}

/** Best-effort cleanup of the throwaway user this script creates. Deletion
 * goes straight to Prisma (no DELETE /api/users endpoint exists) — this only
 * works when run from within the repo (as scripts/load-test.js always is),
 * and against the SAME database the target server is using. Never fatal:
 * a CI throwaway Postgres container is wiped after the job anyway. */
async function deleteThrowawayUser(email) {
  try {
    const dbModuleUrl = pathToFileURL(join(__dirname, '..', 'backend', 'db.js'))
    const { default: prisma } = await import(dbModuleUrl)
    await prisma.user.deleteMany({ where: { email } })
    await prisma.$disconnect()
  } catch (err) {
    console.warn(`⚠️  Could not clean up throwaway load-test user (${email}): ${err.message}`)
  }
}

async function main() {
  console.log(`\n🔥 Load test against ${BASE_URL}\n${'─'.repeat(60)}`)

  const { token, email } = await signUpThrowawayUser()
  let failed = false

  // ── Phase 1: 50 concurrent requests — correctness + latency ────────────
  console.log('Phase 1: 50 concurrent POST /api/analyze requests…')
  const phase1 = await fireBurst(token, 50)

  const statusCounts = {}
  for (const r of phase1) statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1
  console.log('  Status breakdown:', statusCounts)

  const serverErrors = phase1.filter((r) => typeof r.status === 'number' && r.status >= 500)
  const badStatuses = phase1.filter((r) => !(r.status === 200 || r.status === 429))

  if (serverErrors.length > 0) {
    console.error(`❌ ${serverErrors.length}/50 requests returned a 5xx error — expected none.`)
    failed = true
  } else {
    console.log('✅ No 500s under a 50-concurrent-request burst.')
  }

  if (badStatuses.length > 0) {
    console.error(`❌ ${badStatuses.length}/50 requests returned a status other than 200/429.`)
    failed = true
  } else {
    console.log('✅ Every response was 200 or 429.')
  }

  const successful = phase1.filter((r) => r.status === 200)
  const avgMs = successful.length > 0
    ? successful.reduce((sum, r) => sum + r.ms, 0) / successful.length
    : null

  if (avgMs === null) {
    console.error('❌ No successful (200) responses to measure average latency from.')
    failed = true
  } else if (avgMs >= AVG_RESPONSE_TIME_BUDGET_MS) {
    console.error(`❌ Average response time ${avgMs.toFixed(0)}ms exceeds the ${AVG_RESPONSE_TIME_BUDGET_MS}ms budget for local diagnosis.`)
    failed = true
  } else {
    console.log(`✅ Average response time: ${avgMs.toFixed(0)}ms (budget: ${AVG_RESPONSE_TIME_BUDGET_MS}ms)`)
  }

  // ── Phase 2: prove the rate limiter genuinely engages ───────────────────
  // The app's limiter (backend/app.js) allows 100 req/min per IP across ALL
  // /api/ routes, not per-route — a 50-request burst alone won't cross it
  // (by design, so normal traffic isn't throttled). Fire enough additional
  // requests to comfortably exceed the 100/min window and confirm at least
  // one 429 actually comes back, rather than assuming the app's threshold
  // matches an arbitrary test burst size.
  console.log('\nPhase 2: additional burst to confirm the rate limiter engages…')
  const phase2 = await fireBurst(token, 80)
  const rateLimited = phase2.filter((r) => r.status === 429).length
  console.log(`  ${rateLimited}/80 requests were rate-limited (429) in phase 2.`)

  if (rateLimited === 0) {
    console.error('❌ Rate limiter did not engage even after exceeding the configured 100 req/min window.')
    failed = true
  } else {
    console.log('✅ Rate limiter correctly kicks in once the request budget is exceeded.')
  }

  await deleteThrowawayUser(email)

  console.log('─'.repeat(60))
  if (failed) {
    console.error('❌ Load test FAILED — see findings above.')
    process.exit(1)
  }
  console.log('✅ Load test passed.')
}

main().catch((err) => {
  console.error('❌ Load test crashed:', err)
  process.exit(1)
})
