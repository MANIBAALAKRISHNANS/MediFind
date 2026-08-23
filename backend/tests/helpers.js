// Shared helpers for backend/tests/*.test.js — creating/cleaning up throwaway
// test users against a REAL database (see README note in each test file for
// how CI provisions one). Every test user gets a unique, easily-recognisable
// email so cleanup can never accidentally touch a real account.
//
// app.js deliberately doesn't load .env itself (server.js, the real
// entrypoint, owns that) — since tests import app.js directly, load it here.
import 'dotenv/config'

import app from '../app.js'
import prisma from '../db.js'

export { app }

let _counter = 0

/** A unique email per call, scoped to this test run — safe to run tests in
 * parallel. Uses .com (not .test) — Joi's email validator rejects reserved
 * TLDs like .test/.example as not "valid", so a fixture using them would
 * fail signup with a Joi error, not the behaviour under test. */
export function uniqueEmail(prefix = 'citest') {
  _counter += 1
  return `${prefix}-${Date.now()}-${process.pid}-${_counter}@example.com`
}

/**
 * Signs up a throwaway user via the real POST /api/auth/signup endpoint (so
 * the test exercises the actual signup path, not a DB shortcut) and returns
 * { user, token, email, password }.
 */
export async function createTestUser(request, { name = 'CI Test User', password = 'testpass123' } = {}) {
  const email = uniqueEmail()
  const res = await request.post('/api/auth/signup').send({ name, email, password })
  if (res.status !== 201) {
    throw new Error(`createTestUser: signup failed (${res.status}): ${JSON.stringify(res.body)}`)
  }
  return { user: res.body.user, token: res.body.token, email, password }
}

/** Deletes a test user (and, via onDelete: Cascade, their analyses) by email. */
export async function deleteTestUser(email) {
  await prisma.user.deleteMany({ where: { email } })
}
