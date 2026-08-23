// backend/tests/history.test.js — GET /api/history (and /:id, DELETE /:id).
// Requires a real database — an analysis is created via the real POST
// /api/analyze endpoint so history reflects genuine app behaviour, not a DB
// shortcut.
import { describe, test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'

import { app, createTestUser, deleteTestUser, uniqueEmail } from './helpers.js'

let token
let email
let analysisId

before(async () => {
  const testUser = await createTestUser(request(app))
  token = testUser.token
  email = testUser.email

  const analyze = await request(app)
    .post('/api/analyze')
    .set('Authorization', `Bearer ${token}`)
    .send({ symptoms: 'sore throat and mild fever for two days' })
  analysisId = analyze.body.analysisId
})

after(async () => {
  await deleteTestUser(email)
})

describe('GET /api/history (protected)', () => {
  test('requires auth — 401 without a token', async () => {
    const res = await request(app).get('/api/history')
    assert.equal(res.status, 401)
  })

  test("returns the authenticated user's history, including the just-created analysis", async () => {
    const res = await request(app).get('/api/history').set('Authorization', `Bearer ${token}`)

    assert.equal(res.status, 200)
    assert.ok(Array.isArray(res.body.analyses))
    assert.ok(res.body.analyses.some((a) => a.id === analysisId))
  })

  test('never returns another user\'s analyses', async () => {
    const otherEmail = uniqueEmail('other')
    const otherUser = await request(app).post('/api/auth/signup').send({
      name: 'Other User',
      email: otherEmail,
      password: 'testpass123',
    })

    try {
      const res = await request(app).get('/api/history').set('Authorization', `Bearer ${otherUser.body.token}`)

      assert.equal(res.status, 200)
      assert.ok(!res.body.analyses.some((a) => a.id === analysisId))
    } finally {
      await deleteTestUser(otherEmail)
    }
  })
})

describe('GET /api/history/:id', () => {
  test('returns the analysis by id for its owner', async () => {
    const res = await request(app).get(`/api/history/${analysisId}`).set('Authorization', `Bearer ${token}`)
    assert.equal(res.status, 200)
    assert.equal(res.body.id, analysisId)
  })

  test('returns 404 for an unknown id', async () => {
    const res = await request(app)
      .get('/api/history/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
    assert.equal(res.status, 404)
  })
})
