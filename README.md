# MediFind

## Overview

MediFind is a medical triage tool that helps users identify potential conditions based on their symptoms and find nearby healthcare facilities.

**Important:** MediFind uses a rule-based symptom analysis engine. It is NOT a diagnostic tool and does NOT replace professional medical advice. Always consult a qualified healthcare provider.

## Architecture

- **Backend:** Node.js + Express + Prisma + PostgreSQL (shared by web and mobile)
- **Frontend (Web):** React + Vite + Tailwind CSS
- **Frontend (Mobile):** Native Android app built with Kotlin + Jetpack Compose
- **Diagnosis Engine:** Local rule-based NLP system (no external AI APIs) — 275 disease entries scored against free-text symptoms; see [`backend/utils/localDiagnosis.js`](backend/utils/localDiagnosis.js)
- **Facility Search:** OpenStreetMap Overpass API, with a 34-specialty alias map and progressive radius expansion (5→10→15→25km)

There is no Gemini/OpenAI/any external LLM call anywhere in this project, and no Capacitor — the Android app is 100% native Kotlin, calling the same REST API as the web app directly via Retrofit/OkHttp.

## Project Structure

```
.
├── backend/                         Express API (Node.js, ESM)
│   ├── app.js                       Express app — middleware, routes, error handling (no listen())
│   ├── server.js                    Entrypoint — env validation, DB connect, app.listen()
│   ├── config/                      Shared constants (e.g. socket timeout)
│   ├── middleware/                  auth.js (JWT), validate.js (Joi)
│   ├── routes/                      auth.js, analyze.js, findDoctor.js, history.js, health.js
│   ├── utils/
│   │   ├── localDiagnosis.js        The diagnosis engine — scoring, red-flag safety net
│   │   ├── ranking.js               Facility scoring + the specialty alias map
│   │   ├── cache.js                 Two-pool in-memory cache (falls back from Redis)
│   │   ├── geohash.js               Overpass cache-key bucketing
│   │   ├── indianDiseasePatterns.js Regional pattern cross-validation
│   │   ├── nlp/                     tokenizer, synonyms, duration/severity/negation parsing
│   │   └── diseases/                275 disease entries, grouped by category
│   ├── prisma/                      schema.prisma + migrations (PostgreSQL)
│   ├── test/                        node:test — engine/cache/timeout unit tests
│   └── tests/                       node:test + supertest — real HTTP route tests
│
├── frontend-web/                    React + Vite web app
│   └── src/
│       ├── api/client.js            axios instance — attaches the Bearer token, normalises errors
│       ├── components/               SymptomInput, DiagnosisCard, BestMatchCard, etc.
│       ├── pages/                    HomePage, HistoryPage, auth/*
│       ├── services/                 authService, apiService, historyService (localStorage), locationService
│       ├── store/authStore.js        Zustand auth state
│       └── __tests__/                Vitest + Testing Library unit tests
│   └── e2e/                          Playwright end-to-end spec
│
├── android-app/                     Native Kotlin app (Jetpack Compose, MVVM, Hilt)
│   └── app/src/main/java/com/medifind/app/
│       ├── data/api/                 Retrofit interface + models
│       ├── data/local/               Room (offline history cache)
│       ├── data/repository/          Auth/Analysis/Doctor/History repositories
│       ├── ui/screens/, ui/components/
│       └── viewmodel/
│
├── scripts/                         security-review.js, load-test.js, run-tests.sh
└── .github/workflows/medifind-ci.yml   CI pipeline (see below)
```

## Setup & Running

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- Android Studio + JDK 17 (only if you're building the Android app)

### Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET at minimum
npx prisma migrate deploy
npm run dev                 # http://localhost:5000, auto-restarts on change
```

### Web Frontend

```bash
cd frontend-web
npm install
npm run dev                 # https://localhost:5173 — Vite proxies /api → localhost:5000
```

### Android App

```bash
cd android-app
./gradlew assembleDebug
```

The debug build points at `http://10.0.2.2:5000` (the Android emulator's loopback to the host machine) by default — start the backend locally first. For a physical device on the same network: `./gradlew assembleDebug -PAPI_BASE_URL=http://<your-lan-ip>:5000/`. See [`android-app/README.md`](android-app/README.md) for details.

## Environment Variables

**Backend** (`backend/.env` — see `backend/.env.example`):

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | ≥32 chars — server refuses to boot without this |
| `PORT` | No | Default `5000` |
| `NODE_ENV` | No | `development` / `production` |
| `CORS_ORIGIN` | Production only | Comma-separated web-frontend origin(s) — server refuses to boot in production without this. Doesn't affect the native Android app (no Origin header sent). |
| `SUPPORT_EMAIL` | No | Shown in reset-password emails |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | No | Password-reset email delivery (falls back to Resend, then a console-logged link in dev) |
| `RESEND_API_KEY` | No | Preferred mail provider — HTTP API, no SMTP port needed |
| `FRONTEND_URL` | No | Used to build password-reset links |
| `REDIS_URL` | No | Shared cache/rate-limit store across instances — falls back to per-instance in-memory caches if unset |

**Frontend web** (`frontend-web/.env` — see `frontend-web/.env.example`):

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | No | Backend URL for production builds. Empty in dev (Vite proxies `/api`). |

There is no `GEMINI_API_KEY` or any other AI-provider key — the diagnosis engine is entirely local.

## Testing

```bash
# Everything at once:
./scripts/run-tests.sh              # backend + frontend unit tests
./scripts/run-tests.sh --security   # + the security-review checks

# Individually:
cd backend && npm test              # node:test — engine, cache, and real-HTTP route tests
cd frontend-web && npm test         # vitest + Testing Library
cd frontend-web && npm run test:e2e # Playwright, against a running backend + built frontend
cd android-app && ./gradlew test    # Kotlin unit tests (viewmodel/, repository/)

# Needs a running backend (BASE_URL defaults to http://localhost:5000):
node scripts/load-test.js
```

CI (`.github/workflows/medifind-ci.yml`) runs all of the above — plus `npm audit`, an Android debug-APK build, and a live-deployment check — on every push/PR.

## Deployment

- **Backend:** Render (`render.yaml`) — Node web service, `npx prisma migrate deploy` on build, health check at `/api/health`. Any Node host with a PostgreSQL connection works equally well.
- **Web frontend:** Static hosting (Render Static Site, Vercel, Netlify, etc.) serving `frontend-web/dist` after `npm run build`, with `VITE_API_URL` set at build time to the deployed backend URL.
- **Android:** `./gradlew assembleRelease` (update the release `API_BASE_URL` in `android-app/app/build.gradle.kts` first) — distribute via Play Store or direct APK.

## Security

- JWT-based authentication with HttpOnly cookies (web) / Bearer token (Android)
- Token-based password reset: random 32-byte token, SHA-256-hashed at rest, 1-hour expiry, uniform response regardless of whether the email exists (no user enumeration)
- Rate limiting (Redis-backed in production, in-memory single-instance fallback)
- Helmet security headers
- Input validation via Joi
- Server refuses to boot in production without `CORS_ORIGIN` or a long-enough `JWT_SECRET`

## Known Limits

- **Three independent, separately-bounded in-memory caches**, each with its own eviction policy — none share a memory budget:
  - `default` pool (`backend/utils/cache.js`) — 500 entries, FIFO — diagnosis results, misc.
  - `overpass` pool (`backend/utils/cache.js`) — 1,500 entries, FIFO — facility-search responses
  - `normalize()` memoization (`backend/utils/nlp/tokenizer.js`) — 8,000 entries, FIFO — the disease-DB text-normalization cache that makes the diagnosis engine fast under concurrency
  
  All three are per-process; without `REDIS_URL` set, the first two (and rate limiting) don't share state across multiple backend instances.
- The local diagnosis engine is rule-based, not a machine-learning model — its accuracy is bounded by the 275-entry disease database's coverage, not by training data.
- Doctor search depends on OpenStreetMap data completeness for the user's area — sparse regions may return few or no results even when facilities exist.

## Medical Disclaimer

MediFind provides preliminary health information based on a local, rule-based symptom-matching engine. It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician or other healthcare provider with any questions regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you read or were shown in this application. If you think you may have a medical emergency, call your local emergency number (India: 112 or 108) immediately.

## Contact

medifindofficial@gmail.com
