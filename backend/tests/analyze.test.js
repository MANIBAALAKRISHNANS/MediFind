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

  // ── Real emergency red-flag phrases through the FULL HTTP pipeline ────────
  // Each of these goes through the actual route handler exactly as a real
  // request would: 400-length-check → cache lookup (miss, first use) →
  // localDiagnose() → applyIndiaPatternCrossCheck() → stripMedicineRecommendations()
  // → DB write → JSON response. Not calling localDiagnose() directly — this
  // is checking that nothing in that surrounding pipeline can silently
  // downgrade urgency before it reaches the client. Three distinct red-flag
  // entries fixed earlier in this project's red_flags-rewrite pass.
  const EMERGENCY_PHRASES = [
    { label: 'thunderclap headache (headache_thunderclap / redflag_sudden_severe_headache)',
      symptoms: 'sudden severe headache, worst headache of my life' },
    { label: 'heart attack (heart_attack)',
      symptoms: 'crushing chest pain radiating to my arm and jaw with sweating' },
    { label: 'stroke warning (central_stroke_warning / redflag_one_sided_weakness_speech)',
      symptoms: 'sudden one-sided weakness in my face and arm with slurred speech' },
    { label: 'testicular torsion (testicular_torsion_warning / redflag_sudden_testicular_pain)',
      symptoms: 'sudden severe testicular pain that started an hour ago' },
  ]

  for (const { label, symptoms } of EMERGENCY_PHRASES) {
    test(`emergency red flag survives the full /api/analyze pipeline — ${label}`, async () => {
      const res = await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${token}`)
        .send({ symptoms })

      assert.equal(res.status, 200)
      assert.equal(res.body.urgency, 'emergency', `expected urgency:'emergency' for "${symptoms}", got: ${JSON.stringify(res.body)}`)
    })
  }

  test('urgency: emergency survives a CACHE HIT too (identical request sent twice)', async () => {
    const symptoms = 'sudden severe headache, worst headache of my life, cache-hit check'

    // First call: cache miss — computed fresh via localDiagnose() +
    // applyIndiaPatternCrossCheck(), then cached (routes/analyze.js: cacheSet).
    const first = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ symptoms })
    assert.equal(first.status, 200)
    assert.equal(first.body.urgency, 'emergency')

    // Second call, same exact text → same cache key (routes/analyze.js:
    // `trimmed.toLowerCase().replace(/\s+/g, ' ')`) → cache HIT. Per the
    // real code, the cache-hit branch calls ONLY stripMedicineRecommendations()
    // (which touches `recommendations`, never `urgency`) and explicitly does
    // NOT call applyIndiaPatternCrossCheck() again — that already ran once
    // when the cache was populated, and its result (which itself never
    // lowers urgency — see backend/routes/analyze.js applyIndiaPatternCrossCheck,
    // the only severity mutation there is mild→moderate, and it never
    // touches `urgency` in either direction) is baked into the cached object.
    const second = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ symptoms })
    assert.equal(second.status, 200)
    assert.equal(second.body.urgency, 'emergency', `cache hit changed urgency! got: ${JSON.stringify(second.body)}`)
    assert.notEqual(second.body.analysisId, first.body.analysisId, 'each call should still write its own history row even on a cache hit')
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
