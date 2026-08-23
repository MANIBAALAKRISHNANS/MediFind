#!/usr/bin/env node
// scripts/security-review.js — the "security-review" CI job's custom check.
// Verifies, against the REAL source files (not a canned/mocked report), that:
//   1. No hardcoded API keys/secrets appear in source
//   2. .env files are excluded via .gitignore
//   3. JWT_SECRET's length requirement is enforced in code
//   4. The password-reset flow requires token verification
//   5. The CORS production guard exists
// Exits 1 (failing the CI job) on the first category with a real finding;
// prints every check's result either way so a failure is legible in CI logs,
// not just an opaque "exit code 1".
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')

const SCAN_DIRS = [
  'backend/routes', 'backend/middleware', 'backend/utils', 'backend/config',
  'backend/app.js', 'backend/server.js', 'backend/db.js',
  'frontend-web/src',
  'android-app/app/src/main/java',
]
const SCAN_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.kt'])
const EXCLUDE_DIR_NAMES = new Set(['node_modules', 'build', 'dist', '.git', '__tests__', 'tests', 'test'])

let failed = false
const results = []

function pass(label, detail) { results.push({ ok: true, label, detail }) }
function fail(label, detail) { results.push({ ok: false, label, detail }); failed = true }

// ── Helpers ───────────────────────────────────────────────────────────────

function walk(relDir, cb) {
  const abs = join(ROOT, relDir)
  let entries
  try { entries = readdirSync(abs) } catch { return }
  for (const entry of entries) {
    if (EXCLUDE_DIR_NAMES.has(entry)) continue
    const relPath = join(relDir, entry)
    const absPath = join(ROOT, relPath)
    const stat = statSync(absPath)
    if (stat.isDirectory()) {
      walk(relPath, cb)
    } else if (SCAN_EXTENSIONS.has(extname(entry))) {
      cb(relPath, readFileSync(absPath, 'utf8'))
    }
  }
}

function scanAllSourceFiles(cb) {
  for (const entry of SCAN_DIRS) {
    const abs = join(ROOT, entry)
    try {
      if (statSync(abs).isFile()) {
        if (SCAN_EXTENSIONS.has(extname(entry))) cb(entry, readFileSync(abs, 'utf8'))
        continue
      }
    } catch { continue }
    walk(entry, cb)
  }
}

// ── Check 1: no hardcoded API keys/secrets ──────────────────────────────────
// Well-known SHAPED secret patterns — deliberately narrow (shape-based, not
// "any string near the word 'key'") to avoid false-positiving on legitimate
// code like `process.env.API_KEY` or a Joi schema field named "apiKey".
const SECRET_PATTERNS = [
  { name: 'AWS Access Key ID',      re: /AKIA[0-9A-Z]{16}/ },
  { name: 'AWS Secret Access Key',  re: /aws(.{0,20})?['"][0-9a-zA-Z/+=]{40}['"]/i },
  { name: 'Stripe live secret key', re: /sk_live_[0-9a-zA-Z]{20,}/ },
  { name: 'Google API key',         re: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: 'Slack token',            re: /xox[baprs]-[0-9a-zA-Z-]{10,}/ },
  { name: 'Private key block',      re: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Generic JWT-shaped literal assigned to a secret-looking variable',
    re: /(secret|token|api[_-]?key)\s*[:=]\s*['"]eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}['"]/i },
]

const secretFindings = []
scanAllSourceFiles((relPath, content) => {
  for (const { name, re } of SECRET_PATTERNS) {
    const match = content.match(re)
    if (match) secretFindings.push(`${relPath}: ${name} (matched "${match[0].slice(0, 24)}…")`)
  }
})

if (secretFindings.length === 0) {
  pass('No hardcoded API keys/secrets in source', `scanned ${SCAN_DIRS.join(', ')}`)
} else {
  fail('Hardcoded secret pattern(s) found in source', secretFindings.join('\n    '))
}

// ── Check 2: .env files are gitignored ──────────────────────────────────────
let gitignore = ''
try { gitignore = readFileSync(join(ROOT, '.gitignore'), 'utf8') } catch { /* handled below */ }

const REQUIRED_ENV_IGNORES = ['.env', 'backend/.env', 'frontend-web/.env']
const missingIgnores = REQUIRED_ENV_IGNORES.filter((pattern) => !gitignore.split('\n').some((l) => l.trim() === pattern))

if (gitignore && missingIgnores.length === 0) {
  pass('.env files are gitignored', REQUIRED_ENV_IGNORES.join(', '))
} else if (!gitignore) {
  fail('.gitignore is missing at the repo root', 'cannot confirm .env is excluded from version control')
} else {
  fail('.gitignore does not cover all .env locations', `missing: ${missingIgnores.join(', ')}`)
}

// ── Check 3: JWT_SECRET length requirement enforced in code ─────────────────
let serverJs = ''
try { serverJs = readFileSync(join(ROOT, 'backend/server.js'), 'utf8') } catch { /* handled below */ }

const jwtLengthCheck = /_jwtSecret\.length\s*<\s*32|JWT_SECRET.{0,40}\.length\s*<\s*32/.test(serverJs)
const jwtExitsOnFailure = /JWT_SECRET/.test(serverJs) && /process\.exit\(1\)/.test(serverJs)

if (jwtLengthCheck && jwtExitsOnFailure) {
  pass('JWT_SECRET length (≥32 chars) is enforced at boot', 'backend/server.js exits(1) if missing/short')
} else {
  fail('JWT_SECRET length is not enforced in code', 'expected a `.length < 32` boot-time check in backend/server.js that exits the process')
}

// ── Check 4: password reset requires token verification ─────────────────────
let authJs = ''
try { authJs = readFileSync(join(ROOT, 'backend/routes/auth.js'), 'utf8') } catch { /* handled below */ }

const resetRequiresToken =
  /token:\s*Joi\.string\(\).*required\(\)/s.test(authJs) &&           // Joi schema requires it
  /resetToken:\s*hashedToken/.test(authJs) &&                          // looked up BY the hashed token
  /createHash\(['"]sha256['"]\)/.test(authJs)                          // token is hashed before storage/lookup

if (resetRequiresToken) {
  pass('Password reset requires token verification', 'backend/routes/auth.js: Joi-required token, hashed + looked up before allowing a reset')
} else {
  fail('Password reset does not appear to require a verified token', 'expected a required `token` field, hashed with sha256, used as the DB lookup key')
}

// ── Check 5: CORS production guard exists ────────────────────────────────────
const corsGuard = /NODE_ENV === ['"]production['"]\s*&&\s*!process\.env\.CORS_ORIGIN/.test(serverJs) && /process\.exit\(1\)/.test(serverJs)

if (corsGuard) {
  pass('CORS production guard exists', 'backend/server.js refuses to boot in production without CORS_ORIGIN set')
} else {
  fail('CORS production guard not found', 'expected backend/server.js to exit(1) in production when CORS_ORIGIN is unset')
}

// ── Report ────────────────────────────────────────────────────────────────
console.log('\n🔒 Security Review\n' + '─'.repeat(60))
for (const r of results) {
  console.log(`${r.ok ? '✅' : '❌'} ${r.label}`)
  if (r.detail) console.log(`   ${r.detail.split('\n').join('\n   ')}`)
}
console.log('─'.repeat(60))
console.log(`${results.filter((r) => r.ok).length}/${results.length} checks passed`)

if (failed) {
  console.error('\n❌ Security review FAILED — see findings above.')
  process.exit(1)
} else {
  console.log('\n✅ Security review passed.')
}
