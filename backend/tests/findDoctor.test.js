// backend/tests/findDoctor.test.js — POST /api/find-doctor.
// The Overpass API call is mocked (see backend/test/findDoctor.test.js for
// the same mocking pattern applied to the lower-level retry/timeout logic
// directly) — no live network call to overpass-api.de happens here. Requires
// a real database (for auth).
import { describe, test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import axios from 'axios'

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

function fakeCardiologyHospital(lat, lng) {
  return {
    type: 'node',
    id: 111,
    lat,
    lon: lng,
    tags: { amenity: 'hospital', name: 'Test Heart Centre', 'contact:phone': '044-1234567' },
  }
}

describe('POST /api/find-doctor (protected)', () => {
  test('requires auth — 401 without a token', async () => {
    const res = await request(app).post('/api/find-doctor').send({ lat: 13.08, lng: 80.27, specialty: 'cardiologist' })
    assert.equal(res.status, 401)
  })

  test('valid coordinates return a best-match result (Overpass mocked)', async (t) => {
    t.mock.method(axios, 'post', async (_url, body) => {
      // Only the first (5km) tier needs to return something for this test.
      return { data: { elements: [fakeCardiologyHospital(13.081, 80.271)] } }
    })

    const res = await request(app)
      .post('/api/find-doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 13.0827, lng: 80.2707, specialty: 'cardiologist' })

    assert.equal(res.status, 200)
    assert.equal(res.body.bestMatch.name, 'Test Heart Centre')
    assert.equal(typeof res.body.bestMatch.distanceKm, 'number')
    assert.equal(res.body.source, 'OpenStreetMap')
  })

  test('zero Overpass results at every radius returns a clear 404, not a 500', async (t) => {
    t.mock.method(axios, 'post', async () => ({ data: { elements: [] } }))

    const res = await request(app)
      .post('/api/find-doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 10.5, lng: 76.5, specialty: 'dermatologist' })

    assert.equal(res.status, 404)
    assert.equal(res.body.code, 'NO_RESULTS')
  })

  test('invalid latitude (out of -90..90 range) returns 400', async () => {
    const res = await request(app)
      .post('/api/find-doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 999, lng: 80.27, specialty: 'cardiologist' })

    assert.equal(res.status, 400)
    assert.equal(res.body.code, 'INVALID_INPUT')
  })

  test('missing specialty returns 400', async () => {
    const res = await request(app)
      .post('/api/find-doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 13.08, lng: 80.27 })

    assert.equal(res.status, 400)
  })

  test('an Overpass timeout is surfaced as a clear 504, not a 500', async (t) => {
    t.mock.method(axios, 'post', async () => {
      const err = new Error('timeout of 15000ms exceeded')
      err.code = 'ECONNABORTED'
      throw err
    })

    const res = await request(app)
      .post('/api/find-doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 19.076, lng: 72.877, specialty: 'general physician' })

    assert.equal(res.status, 504)
    assert.equal(res.body.code, 'OVERPASS_TIMEOUT')
  })
})
