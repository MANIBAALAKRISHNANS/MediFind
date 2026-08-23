// backend/tests/auth.test.js — signup, login, logout, forgot-password
// (uniform response — no user enumeration), reset-password (requires token).
// Requires a real database — see health.test.js header comment.
import { describe, test, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'

import { app, uniqueEmail, deleteTestUser } from './helpers.js'

const createdEmails = []

after(async () => {
  await Promise.all(createdEmails.map(deleteTestUser))
})

describe('POST /api/auth/signup', () => {
  test('creates a new user and returns a token', async () => {
    const email = uniqueEmail()
    createdEmails.push(email)

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Signup Test', email, password: 'testpass123' })

    assert.equal(res.status, 201)
    assert.equal(res.body.user.email, email)
    assert.equal(typeof res.body.token, 'string')
    assert.equal(res.body.user.password, undefined) // never leak the hash
  })

  test('rejects a duplicate email with 409', async () => {
    const email = uniqueEmail()
    createdEmails.push(email)

    await request(app).post('/api/auth/signup').send({ name: 'Dup A', email, password: 'testpass123' })
    const res = await request(app).post('/api/auth/signup').send({ name: 'Dup B', email, password: 'testpass123' })

    assert.equal(res.status, 409)
    assert.equal(res.body.code, 'EMAIL_TAKEN')
  })

  test('rejects a weak password (no digit) with 400', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Weak Pw', email: uniqueEmail(), password: 'onlyletters' })

    assert.equal(res.status, 400)
  })
})

describe('POST /api/auth/login', () => {
  test('logs in with correct credentials', async () => {
    const email = uniqueEmail()
    createdEmails.push(email)
    await request(app).post('/api/auth/signup').send({ name: 'Login Test', email, password: 'testpass123' })

    const res = await request(app).post('/api/auth/login').send({ email, password: 'testpass123' })

    assert.equal(res.status, 200)
    assert.equal(typeof res.body.token, 'string')
  })

  test('rejects wrong password with 401 (same message as unknown email — no enumeration)', async () => {
    const email = uniqueEmail()
    createdEmails.push(email)
    await request(app).post('/api/auth/signup').send({ name: 'Login Test 2', email, password: 'testpass123' })

    const wrongPw = await request(app).post('/api/auth/login').send({ email, password: 'wrongpassword1' })
    const unknown  = await request(app).post('/api/auth/login').send({ email: uniqueEmail(), password: 'wrongpassword1' })

    assert.equal(wrongPw.status, 401)
    assert.equal(unknown.status, 401)
    assert.equal(wrongPw.body.error, unknown.body.error)
  })
})

describe('POST /api/auth/logout', () => {
  test('requires auth (401 without a token)', async () => {
    const res = await request(app).post('/api/auth/logout')
    assert.equal(res.status, 401)
  })

  test('logs out successfully with a valid token', async () => {
    const email = uniqueEmail()
    createdEmails.push(email)
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Logout Test', email, password: 'testpass123' })

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${signup.body.token}`)

    assert.equal(res.status, 200)
  })
})

describe('POST /api/auth/forgot-password — uniform response (no user enumeration)', () => {
  test('returns the same 200 response for an existing account', async () => {
    const email = uniqueEmail()
    createdEmails.push(email)
    await request(app).post('/api/auth/signup').send({ name: 'Forgot Test', email, password: 'testpass123' })

    const res = await request(app).post('/api/auth/forgot-password').send({ email })

    assert.equal(res.status, 200)
    assert.equal(res.body.message, 'If an account with that email exists, a password reset link has been sent.')
  })

  test('returns the SAME 200 response for a non-existent account (never 404)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: uniqueEmail('does-not-exist') })

    assert.equal(res.status, 200)
    assert.equal(res.body.message, 'If an account with that email exists, a password reset link has been sent.')
  })
})

describe('POST /api/auth/reset-password — requires a token', () => {
  test('rejects with 400 when the token field is missing', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: uniqueEmail(), newPassword: 'newpass123' })

    assert.equal(res.status, 400)
  })

  test('rejects an invalid/unknown token with 400', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: uniqueEmail(), token: 'a'.repeat(64), newPassword: 'newpass123' })

    assert.equal(res.status, 400)
    assert.equal(res.body.code, 'INVALID_RESET_TOKEN')
  })

  test('a request with only an email (no token) can NEVER reset a password', async () => {
    const email = uniqueEmail()
    createdEmails.push(email)
    await request(app).post('/api/auth/signup').send({ name: 'No Token Test', email, password: 'testpass123' })

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email, newPassword: 'newpass123' })   // deliberately no token

    assert.equal(res.status, 400)

    // Confirm the password genuinely did not change.
    const login = await request(app).post('/api/auth/login').send({ email, password: 'testpass123' })
    assert.equal(login.status, 200)
  })
})
