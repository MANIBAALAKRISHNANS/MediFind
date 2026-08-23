import { Router } from 'express'
import crypto from 'crypto'
import Joi from 'joi'
import nodemailer from 'nodemailer'
import dns from 'dns/promises'

import prisma from '../db.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { generateToken } from '../utils/token.js'
import { toSafeUser } from '../utils/userSafe.js'
import { requireAuth, COOKIE_NAME } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// ── Validation schemas ────────────────────────────────────────────────────────

const signupSchema = Joi.object({
  name:     Joi.string().min(2).max(60).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).required()
    .messages({ 'string.pattern.base': 'Password must contain at least one letter and one number.' }),
})

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
})

const forgotSchema = Joi.object({
  email: Joi.string().email().required(),
})

const resetSchema = Joi.object({
  email:       Joi.string().email().required(),
  token:       Joi.string().hex().length(64).required()
    .messages({
      'string.empty':  'A reset token is required.',
      'any.required':  'A reset token is required.',
      'string.hex':    'Invalid reset token.',
      'string.length': 'Invalid reset token.',
    }),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).required()
    .messages({ 'string.pattern.base': 'Password must contain at least one letter and one number.' }),
})

const profileSchema = Joi.object({
  name:  Joi.string().min(2).max(60).required(),
  email: Joi.string().email().required(),
})

// ── Cookie helpers ────────────────────────────────────────────────────────────
// Web clients receive an HttpOnly cookie; Capacitor clients read the token from
// the JSON response body and send it back as an Authorization: Bearer header.

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  secure:   process.env.NODE_ENV === 'production',
  maxAge:   7 * 24 * 60 * 60 * 1000,   // 7 days — matches JWT expiry
}

function setTokenCookie(res, token) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
}

function clearTokenCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'strict', secure: COOKIE_OPTIONS.secure })
}

// ── Mailer ────────────────────────────────────────────────────────────────────
// Strategy (in order):
//   1. Resend HTTP API  — works on any network (no SMTP port needed). Preferred.
//      Set RESEND_API_KEY in .env. Get a free key at https://resend.com
//   2. Nodemailer SMTP  — fallback for environments where SMTP ports are open
//      (e.g. Render / cloud servers). Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
//   3. Console fallback — always logs the reset URL so local dev never gets stuck.

// ── Resend client (lazy — only instantiated if API key is present) ────────────
let resendClient = null
if (process.env.RESEND_API_KEY) {
  const { Resend } = await import('resend')
  resendClient = new Resend(process.env.RESEND_API_KEY)
  console.log('📧 Mailer: Resend HTTP API ready')
}

// ── Nodemailer SMTP transporter (lazy — only when SMTP is configured) ─────────
// Pre-resolve the hostname to IPv4 to avoid ENETUNREACH on networks where
// IPv6 is unavailable (Node 18+ prefers IPv6 in DNS results by default).
let smtpTransporter = null
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  let _smtpHost = process.env.SMTP_HOST
  try {
    const addrs = await dns.resolve4(_smtpHost)
    if (addrs.length) _smtpHost = addrs[0]
  } catch { /* keep hostname as-is */ }

  smtpTransporter = nodemailer.createTransport({
    host:              _smtpHost,
    port:              Number(process.env.SMTP_PORT) || 587,
    secure:            Number(process.env.SMTP_PORT) === 465,
    requireTLS:        true,
    auth:              { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout:   10_000,
  })
  console.log('📧 Mailer: SMTP transporter ready (fallback)')
}

// ── Email HTML template ───────────────────────────────────────────────────────
function buildResetHtml(resetUrl, support) {
  const resetUrlHtml = resetUrl.replace(/&/g, '&amp;')
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 16px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #d1fae5;overflow:hidden;max-width:480px;width:100%">
        <!-- Header -->
        <tr><td style="background:#0d9488;padding:28px 32px">
          <p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold">🏥 MediFind</p>
          <p style="margin:4px 0 0;color:#ccfbf1;font-size:13px">AI Symptom Analysis</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px">
          <p style="margin:0 0 12px;color:#111827;font-size:18px;font-weight:bold">Reset your password</p>
          <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6">
            You requested a password reset for your MediFind account.<br/>
            Click the button below to set a new password. This link <strong>expires in 1 hour</strong>.
          </p>
          <table cellpadding="0" cellspacing="0"><tr><td>
            <a href="${resetUrlHtml}"
               style="display:inline-block;padding:14px 32px;background:#0d9488;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold">
              Reset Password
            </a>
          </td></tr></table>
          <p style="margin:24px 0 0;color:#6b7280;font-size:13px">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#9ca3af;font-size:12px">
            MediFind &middot; AI Symptom Analysis &middot;
            <a href="mailto:${support}" style="color:#0d9488;text-decoration:none">${support}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── sendResetEmail — tries Resend → SMTP → console fallback ──────────────────
async function sendResetEmail(email, token, resetBase) {
  const base     = resetBase || process.env.FRONTEND_URL || 'http://localhost:5000'
  const resetUrl = `${base}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  const support  = process.env.SUPPORT_EMAIL || 'medifindofficial@gmail.com'

  // Always log the link so developers can test without email during local dev
  console.log(`\n🔑 Password reset link:\n   ${resetUrl}\n`)

  // ── 1. Try Resend (HTTP API — works behind any firewall) ───────────────────
  if (resendClient) {
    try {
      await resendClient.emails.send({
        from:    process.env.RESEND_FROM || 'MediFind <onboarding@resend.dev>',
        to:      email,
        subject: 'Reset your MediFind password',
        html:    buildResetHtml(resetUrl, support),
        text:    `Reset your MediFind password\n\nClick the link below (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, ignore this email.\n\nMediFind Team`,
      })
      console.log(`✉️  Reset email sent via Resend to: ${email}`)
      return
    } catch (err) {
      console.warn(`⚠️  Resend failed: ${err.message} — trying SMTP fallback…`)
    }
  }

  // ── 2. Try SMTP (nodemailer — works on cloud servers / open networks) ───────
  if (smtpTransporter) {
    try {
      await smtpTransporter.sendMail({
        from:    `"MediFind" <${process.env.SMTP_USER}>`,
        to:      email,
        subject: 'Reset your MediFind password',
        text:    `Reset your MediFind password\n\nClick the link below (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, ignore this email.\n\nMediFind Team`,
        html:    buildResetHtml(resetUrl, support),
      })
      console.log(`✉️  Reset email sent via SMTP to: ${email}`)
      return
    } catch (err) {
      console.warn(`⚠️  SMTP failed: ${err.message}`)
    }
  }

  // ── 3. Console fallback (local dev) ─────────────────────────────────────────
  console.warn(
    '\n' +
    '╔══════════════════════════════════════════════════════════════════╗\n' +
    '║  ⚠️  MAIL DELIVERY FAILURE (no working mail provider found)      ║\n' +
    `║  Failed to send email to: ${email.padEnd(38)} ║\n` +
    '║                                                                  ║\n' +
    '║  Fix: add RESEND_API_KEY to backend/.env  →  https://resend.com  ║\n' +
    '║                                                                  ║\n' +
    '║  🔑 [LOCAL DEV FALLBACK] Copy & paste this link to reset:        ║\n' +
    `║  ${resetUrl.padEnd(64)} ║\n` +
    '╚══════════════════════════════════════════════════════════════════╝\n'
  )
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Email delivery failed — no working mail provider configured.')
  }
}


// ── POST /api/auth/signup ─────────────────────────────────────────────────────

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  const { name, password } = req.body
  const email = req.body.email.toLowerCase()

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.', code: 'EMAIL_TAKEN' })
    }

    const hashed = await hashPassword(password)
    const user   = await prisma.user.create({ data: { name, email, password: hashed } })
    const token  = generateToken(user)

    setTokenCookie(res, token)
    return res.status(201).json({ user: toSafeUser(user), token })
  } catch (err) {
    return next(err)
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────

router.post('/login', validate(loginSchema), async (req, res, next) => {
  const email = req.body.email.toLowerCase()

  try {
    const user  = await prisma.user.findUnique({ where: { email } })
    const valid = user ? await comparePassword(req.body.password, user.password) : false

    // Same message for both "no user" and "wrong password" — avoids user enumeration
    if (!user || !valid) {
      return res.status(401).json({ error: 'Invalid credentials.', code: 'INVALID_CREDENTIALS' })
    }

    const token = generateToken(user)
    setTokenCookie(res, token)
    return res.json({ user: toSafeUser(user), token })
  } catch (err) {
    return next(err)
  }
})

// ── POST /api/auth/forgot-password ───────────────────────────────────────────

// Same response, same status, whether or not the account exists — never lets
// a client distinguish "email exists" from "email doesn't exist" (user
// enumeration). Do NOT change this to a 404 or a different message for the
// not-found case.
const FORGOT_PASSWORD_RESPONSE = {
  message: 'If an account with that email exists, a password reset link has been sent.',
}

router.post('/forgot-password', validate(forgotSchema), async (req, res, next) => {
  const email = req.body.email.toLowerCase()

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const token       = crypto.randomBytes(32).toString('hex')
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

      await prisma.user.update({
        where: { email },
        data:  { resetToken: hashedToken, resetTokenExpires: new Date(Date.now() + 3600000) },
      })

      try {
        await sendResetEmail(email, token)
      } catch (mailErr) {
        // Logged, never surfaced — surfacing a mail-delivery failure here would let
        // an attacker tell "account exists but mail failed" apart from "no account".
        console.error('[forgot-password] sendResetEmail failed:', mailErr.message)
      }
    }

    return res.json(FORGOT_PASSWORD_RESPONSE)
  } catch (err) {
    return next(err)
  }
})

// ── POST /api/auth/reset-password ────────────────────────────────────────────

router.post('/reset-password', validate(resetSchema), async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex')

    const user = await prisma.user.findFirst({
      where: {
        resetToken:        hashedToken,
        resetTokenExpires: { gt: new Date() },
      },
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.', code: 'INVALID_RESET_TOKEN' })
    }

    const hashedNew = await hashPassword(req.body.newPassword)

    await prisma.user.update({
      where: { id: user.id },
      data:  { password: hashedNew, resetToken: null, resetTokenExpires: null },
    })

    return res.json({ message: 'Password reset successfully.' })
  } catch (err) {
    return next(err)
  }
})

// ── GET /api/auth/me (protected) ─────────────────────────────────────────────

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })

    if (!user) {
      return res.status(404).json({ error: 'User not found.', code: 'NOT_FOUND' })
    }

    return res.json(toSafeUser(user))
  } catch (err) {
    return next(err)
  }
})

// ── PUT /api/auth/profile (protected) ────────────────────────────────────────

router.put('/profile', requireAuth, validate(profileSchema), async (req, res, next) => {
  const newEmail = req.body.email.toLowerCase()

  try {
    if (newEmail !== req.user.email.toLowerCase()) {
      const existing = await prisma.user.findUnique({ where: { email: newEmail } })
      if (existing) {
        return res.status(409).json({ error: 'Email is already in use by another account.', code: 'EMAIL_TAKEN' })
      }
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data:  { name: req.body.name, email: newEmail },
    })

    return res.json(toSafeUser(updated))
  } catch (err) {
    return next(err)
  }
})

// ── POST /api/auth/logout (protected) ────────────────────────────────────────
// Clears the HttpOnly cookie. Capacitor clients should discard their stored token.

router.post('/logout', requireAuth, (req, res) => {
  clearTokenCookie(res)
  return res.json({ message: 'Logged out successfully.' })
})

export default router
