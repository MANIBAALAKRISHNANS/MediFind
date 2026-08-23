// backend/tests/analyze.test.js — POST /api/analyze.
// Uses the real local rule-based diagnosis engine (no external calls to mock)
// — see backend/utils/localDiagnosis.js. Requires a real database.
import { describe, test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'

import { app, createTestUser, deleteTestUser } from './helpers.js'

let token
let email

before(async () => {
  const testUser = await createTestUser(request(app))
  token = testUser.token
  email = testUser.email
})

after(async () => {
  await deleteTestUser(email)
})

describe('POST /api/analyze (protected)', () => {
  test('requires auth — 401 without a token', async () => {
    const res = await request(app).post('/api/analyze').send({ symptoms: 'fever and headache for two days' })
    assert.equal(res.status, 401)
  })

  test('valid symptoms return a diagnosis with the expected shape', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ symptoms: 'crushing chest pain radiating to my arm and sweating' })

    assert.equal(res.status, 200)
    assert.equal(typeof res.body.disease, 'string')
    assert.equal(typeof res.body.confidence, 'number')
    assert.ok(['mild', 'moderate', 'severe'].includes(res.body.severity))
    assert.ok(typeof res.body.urgency === 'string')
    assert.equal(typeof res.body.description, 'string')
    assert.ok(Array.isArray(res.body.recommendations))
    assert.ok(Array.isArray(res.body.redFlags))
    // A DB write happened — analysisId should come back (not null) with a working DB.
    assert.equal(typeof res.body.analysisId, 'string')
  })

  test('a genuine emergency red flag returns urgency: emergency', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ symptoms: 'sudden severe headache, worst headache of my life' })

    assert.equal(res.status, 200)
    assert.equal(res.body.urgency, 'emergency')
  })

  test('empty symptoms return 400', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ symptoms: '' })

    assert.equal(res.status, 400)
    assert.equal(res.body.code, 'INVALID_INPUT')
  })

  test('symptoms under the 10-character minimum return 400', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ symptoms: 'too short' })

    assert.equal(res.status, 400)
  })

  test('missing symptoms field returns 400', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    assert.equal(res.status, 400)
  })
})
