// backend/tests/health.test.js — GET /api/health.
// Requires a real DATABASE_URL (see backend/tests/helpers.js) — CI provisions
// a throwaway Postgres service container; locally, point TEST_DATABASE_URL /
// DATABASE_URL at any Postgres instance (see scripts/run-tests.sh).
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'

import { app } from './helpers.js'

describe('GET /api/health', () => {
  test('returns 200 with status ok and an ISO timestamp', async () => {
    const res = await request(app).get('/api/health')

    assert.equal(res.status, 200)
    assert.equal(res.body.status, 'ok')
    assert.equal(typeof res.body.timestamp, 'string')
    assert.equal(Number.isNaN(Date.parse(res.body.timestamp)), false)
  })
})
