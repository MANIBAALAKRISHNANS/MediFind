# 🏥 MediFind — Symptom Triage & Doctor Finder

> ⚕️ **Medical Disclaimer:** MediFind provides preliminary, rule-based health information only. It uses a local, deterministic symptom-matching engine — **not** artificial intelligence or a machine-learning model — and is **not** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider. In an emergency, call **911 / 112 / 108**.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Complete Function / Module Reference](#-complete-functionmodule-reference)
3. [Architecture Map](#-architecture-map)
4. [Baby-Proof Setup Guide](#-baby-proof-setup-guide)
5. [Common Errors & Fixes](#-common-errors--fixes)
6. [Project File Structure](#-project-file-structure)
7. [Key Concepts Glossary](#-key-concepts-glossary)
8. [Contributing & Development Workflow](#-contributing--development-workflow)

---

## 🌟 Project Overview

### 🧒 Simple Version (ELI5)

Imagine you feel sick and you don't know what is wrong or which type of doctor to see. MediFind is like a very smart health helper that lives on your phone or computer. You type in how you feel — like "I have a fever, headache, and body aches" — and it reads your words, figures out what illness it might be, and then finds the nearest hospital or clinic that specialises in exactly that problem. It shows you the phone number, the address, how far away the place is, and even lets you download a full report to show your real doctor. It remembers every check-up you have ever done so you can look back at them later. Everything is free.

### 👨‍💻 Technical Version

**MediFind** is a full-stack, mobile-first health-tech application. Users describe symptoms in free text; the backend analyses them with a **local, rule-based triage engine** — a weighted symptom-matching system running entirely on the server, with no external AI API calls, no network dependency, and fully deterministic/auditable output. The app then locates the nearest appropriate medical facility via the **OpenStreetMap Overpass API** and scores results with a multi-factor ranking algorithm (distance 40%, specialty match 35%, facility type 15%, data completeness 10%).

**Tech Stack:**

| Layer | Technology | Why chosen |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind CSS | Fast HMR dev loop, iOS-style design system via utility classes |
| State | Zustand | Minimal boilerplate; async-friendly for auth bootstrap |
| Routing | React Router v7 | Nested routes, loader support |
| Mobile | Native Kotlin + Jetpack Compose (see `android-app/`) | Full native Android experience; the web app (`frontend-web/`) is web-only |
| Backend | Node.js + Express | Lightweight; fast in-process rule evaluation, no outbound AI calls to wait on |
| ORM | Prisma + PostgreSQL (local) | Type-safe queries; self-hosted local Postgres for portability and college deployment |
| Diagnosis engine | Local rule-based triage (`backend/utils/localDiagnosis.js` + `backend/utils/diseases/`) | Transparent, deterministic, auditable — every match traces back to a readable disease definition; no API key, no cost, no rate limit, works fully offline |
| Mapping | OpenStreetMap Overpass API | No API key; no billing; global hospital dataset |
| Auth | JWT + HttpOnly cookies | Cookie for browsers (XSS protection), Bearer header for native clients |
| Cache | Redis (optional) → in-memory LRU | Avoids recomputing identical symptom-text queries; degrades gracefully without Redis |
| PDF | PDFKit (server) + HTML print (client) | Server PDF for permanent records; browser print as offline fallback |

**Architecture pattern:** Layered monorepo (`medifind/` root → `backend/` REST API → `frontend/` SPA). Analyses are dual-persisted — immediately to `localStorage` for offline resilience, then asynchronously to PostgreSQL for cross-device access.

---

## 📖 Complete Function/Module Reference

> Grouped by file. Line numbers are approximate. All files are in the `medifind/` root unless prefixed.

---

### `backend/server.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| Express `app` instance | 1 | Creates the application; mounts all middleware and routes | — | Express app | Node.js runtime |
| CORS config | ~20 | Allows cross-origin requests from `FRONTEND_URL` and Android Capacitor origins | — | Middleware | `app.use()` |
| `helmet()` | ~30 | Sets secure HTTP headers (XSS, HSTS, clickjacking protection) | — | Middleware | `app.use()` |
| `compression()` | ~35 | Gzip-compresses all responses | — | Middleware | `app.use()` |
| Global rate limiter | ~45 | Caps every IP at 100 requests per 15 minutes | `windowMs`, `max` | Middleware | `app.use()` |
| Auth rate limiter | ~55 | Caps auth endpoints at 10 requests per 15 minutes per IP | `windowMs`, `max` | Middleware | `/api/auth` routes |
| `app.listen()` | ~last | Starts the HTTP server on `PORT` | `PORT` (env) | Server instance | Node.js runtime |

---

### `backend/db.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `prisma` (singleton) | 1 | Creates one shared PrismaClient connected to PostgreSQL; re-exported to all route files | — | PrismaClient | All route files |

---

### `backend/routes/auth.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `sendResetEmail()` | ~10 | Sends a password-reset email via Nodemailer; in dev mode logs reset URL to console instead | `email, token, resetBase` | `Promise<void>` | `POST /forgot-password` |
| `POST /signup` handler | ~30 | Validates input, hashes password with bcrypt, creates User record, issues 7-day JWT, sets HttpOnly cookie | `{ name, email, password }` body | `{ user, token }` | Express router |
| `POST /login` handler | ~70 | Finds user by email, verifies bcrypt hash, issues JWT | `{ email, password }` body | `{ user, token }` | Express router |
| `POST /forgot-password` handler | ~105 | Generates crypto reset token, saves hashed version to DB with 1-hour expiry, calls `sendResetEmail()` | `{ email }` body | `{ message }` | Express router |
| `POST /reset-password` handler | ~140 | Validates token against DB, checks expiry, hashes and saves new password | `{ email, token, newPassword }` body | `{ message }` | Express router |
| `GET /me` handler | ~175 | Returns the authenticated user's safe profile | JWT via cookie/header | `safeUser` | Express router |
| `PUT /profile` handler | ~190 | Updates `name` and/or `email`; enforces email uniqueness | `{ name, email }` body | `safeUser` | Express router |
| `POST /logout` handler | ~225 | Clears the `mf_token` HttpOnly cookie | — | `{ message }` | Express router |

---

### `backend/routes/analyze.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `adaptToApiResponse()` | ~15 | Maps `localDiagnose()`'s engine-native shape (`{ primary, differentials, inputParsed, disclaimer }`) onto the stable public API JSON shape the frontend/Android clients expect | `diagnosisResult: object` | legacy-shaped diagnosis object | `POST /analyze` handler |
| `stripMedicineRecommendations()` | ~60 | Removes any drug names or dosage instructions from the recommendations array | `diagnosis: object` | `diagnosis: object` | `POST /analyze` handler |
| `applyIndiaPatternCrossCheck()` | ~90 | Runs `detectPatterns()` on symptoms; overrides specialty if a high-confidence India-specific pattern matches | `diagnosis, symptomsText` | `diagnosis: object` | `POST /analyze` handler |
| `POST /analyze` handler | ~120 | Orchestrates: cache check → `localDiagnose()` → adapt to API shape → India cross-check → strip meds → save DB + cache | `{ symptoms, age?, gender? }` body | Full diagnosis object + `analysisId` | Express router |

**Diagnosis pipeline (no external calls):**

| Step | What runs | Typical latency |
|---|---|---|
| 1 | Cache lookup (Redis or in-memory) | < 1 ms on hit |
| 2 | `localDiagnose()` — tokenize, extract features, score every disease in `DISEASE_DB`, rank top 3 | ~1–5 ms |
| 3 | `applyIndiaPatternCrossCheck()` + `stripMedicineRecommendations()` | < 1 ms |
| 4 | Cache write + `prisma.analysis.create()` | DB round-trip only |

---

### `backend/routes/findDoctor.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `buildQuery()` | ~10 | Builds an Overpass QL query string for hospitals, clinics, and doctors near a coordinate | `lat, lng, radius (metres)` | `string` | `queryOverpass()` |
| `mapElement()` | ~40 | Normalises a raw OSM element into a clean facility object (`name`, `address`, `phone`, `lat`, `lng`, `type`) | `osmElement` | facility object | `queryOverpass()` |
| `queryOverpass()` | ~70 | POSTs the Overpass query; tries 5 km radius first, expands to 15 km if empty result | `lat, lng, radius` | `Promise<facility[]>` | `POST /find-doctor` handler |
| `findBestMatch()` | ~110 | Scores all facilities; returns single highest-scored facility | `facilities[], specialty, userLat, userLng` | facility object | `POST /find-doctor` handler |
| `POST /find-doctor` handler | ~150 | Validates coordinates, calls Overpass, scores results, persists best match **including all four score breakdown fields** to DB on the Analysis record | `{ lat, lng, specialty, analysisId? }` body | `{ bestMatch, alternativesCount, source }` | Express router |

---

### `backend/routes/history.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `GET /history` handler | ~10 | Cursor-paginated list of authenticated user's analyses (default limit 20, max 100) | Query: `cursor?, limit?` | `{ analyses[], nextCursor, hasMore }` | Express router |
| `GET /history/:id` handler | ~50 | Fetches one analysis by ID with ownership check | `id` path param | Full `Analysis` record | Express router |
| `DELETE /history/:id` handler | ~80 | Deletes one analysis by ID with ownership check | `id` path param | `{ message }` | Express router |
| `GET /history/:id/pdf` handler | ~100 | Generates and streams a PDFKit report for one analysis | `id` path param | Binary PDF stream (`application/pdf`) | Express router |

---

### `backend/routes/health.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `GET /health` handler | ~5 | Liveness probe; returns server status and timestamp | — | `{ status: 'ok', timestamp }` | Deployment health checks |

---

### `backend/middleware/auth.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `requireAuth()` | ~5 | Reads JWT from `mf_token` HttpOnly cookie OR `Authorization: Bearer` header; verifies signature; attaches `req.user = { id, email }` | `req, res, next` | Calls `next()` or 401 JSON | All protected routes |

---

### `backend/middleware/validate.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `validate()` | ~5 | Higher-order function; returns Express middleware that validates `req.body` against a Joi schema and responds 400 on failure | `joiSchema` | Middleware function | Route handlers |

---

### `backend/utils/password.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `hashPassword()` | ~5 | Hashes a plain-text password with bcrypt at 10 rounds | `plain: string` | `Promise<string>` | Signup, reset-password handlers |
| `comparePassword()` | ~10 | Compares a plain-text password against a bcrypt hash | `plain: string, hashed: string` | `Promise<boolean>` | Login handler |

---

### `backend/utils/token.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `generateToken()` | ~5 | Signs `{ id, email }` with `JWT_SECRET` and a 7-day expiry | `user: { id, email }` | `string` (JWT) | Signup, login handlers |

---

### `backend/utils/userSafe.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `toSafeUser()` | ~5 | Strips `password`, `resetToken`, `resetTokenExpires` before sending user object to the client | `user: PrismaUser` | Safe user object | All auth response handlers |

---

### `backend/utils/ranking.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `haversine()` | ~5 | Computes great-circle distance between two lat/lng pairs using the haversine formula | `lat1, lng1, lat2, lng2` | `distanceKm: number` | `scoreFacility()` |
| `scoreFacility()` | ~30 | Scores one facility across 4 dimensions; hard-disqualifies facilities with negative keywords and no positive ones | `facility, specialty, userLat, userLng` | `{ totalScore, distanceKm, disqualified, breakdown }` | `findBestMatch()` |
| `findBestMatch()` | ~90 | Scores all facilities; prefers specialty-matched results; falls back to closest hospital when no specialty match | `facilities[], specialty, userLat, userLng` | Best facility object | `findDoctor.js` |

**Score weights:**

| Dimension | Weight | Notes |
|---|---|---|
| Distance | 40% | Steep falloff beyond 5 km; zero score after 12 km |
| Specialty match | 35% | Keyword match against facility name + tags |
| Facility type | 15% | Hospital > clinic > doctor > other |
| Data completeness | 10% | Points for having phone, address, hours |

---

### `backend/utils/cache.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `cacheGet()` | ~20 | Reads from Redis (if connected) or the in-memory LRU Map; returns `null` on miss | `key: string` | `Promise<object \| null>` | `/analyze` route |
| `cacheSet()` | ~40 | Writes to Redis or in-memory LRU (max 500 entries, 3-minute TTL) | `key: string, value: object` | `Promise<void>` | `/analyze` route |

---

### `backend/utils/localDiagnosis.js`

The primary and only diagnosis engine — a weighted, multi-factor rule-based scorer. No network calls, no API key, fully deterministic (same input always produces the same output).

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `localDiagnose()` | ~1 | Tokenizes and normalises input, extracts structured features (symptoms, duration, severity qualifiers, risk factors, negations), scores every disease in `DISEASE_DB`, ranks the top 3 matches, runs the red-flag check, and assembles the result | `symptomText: string, { age?, gender?, location? }` | `{ primary, differentials, inputParsed, disclaimer }` | `analyze.js` route |

**Scoring formula** (per candidate disease):

| Factor | Points |
|---|---|
| Each matched primary symptom | `weight × 20` |
| Each matched secondary symptom | `weight × 10` |
| Each matched differentiating symptom | `weight × 15` |
| Duration pattern fits the disease's typical course | `+10` |
| Each matched risk factor | `+5` |
| `india_prevalence: "high"` / `"moderate"` | `+8` / `+4` |
| Current month matches `seasonal_pattern` | `+5` |
| Each explicitly denied primary symptom (`"no fever"`) | `−15` |

A disease qualifies only with **≥ 30 points AND ≥ 2 matched primary symptoms**. Confidence is `min(0.92, primaryRatio×0.6 + secondaryRatio×0.25 + bonus×0.15)`, floored at `0.15` — it never claims certainty, since this is a triage tool, not a diagnosis. Any matched red flag forces `urgency: "emergency"` regardless of the computed confidence.

---

### `backend/utils/nlp/`

Text-processing pipeline used by `localDiagnose()` to turn free-text symptoms into structured, matchable features.

| File | What It Does |
|---|---|
| `synonyms.js` | 200+ symptom synonym/colloquialism map (e.g. `"loose motion" → "diarrhea"`, `"sugar problem" → "diabetes"`) used to normalise both user input and disease definitions onto the same vocabulary before matching |
| `tokenizer.js` | `normalize()` / `tokenize()` — lowercases, strips punctuation, collapses whitespace, and applies the synonym map |
| `durationParser.js` | `parseDuration()` — extracts phrases like `"for 2 days"`, `"since last week"`, `"3 months"` into `{ days, category }` (`acute` / `subacute` / `chronic`) |
| `severityParser.js` | `parseSeverity()` — detects qualifiers like `"severe"`, `"mild"`, `"can't breathe"`, `"unbearable"` and maps them to a severity level |
| `negationDetector.js` | `detectNegations()` — detects `"no fever"`, `"not coughing"`, `"without rash"` so denied symptoms subtract from a disease's score instead of adding to it |

---

### `backend/utils/indianDiseasePatterns.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `detectPatterns()` | ~10 | Matches symptom text against 96 India-prevalent disease patterns; returns those with ≥ 2 keyword hits sorted by match count | `symptomsText: string` | `pattern[]` | `applyIndiaPatternCrossCheck()` |

---

### `backend/utils/pdfReport.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `generateReportPDF()` | ~5 | Builds a multi-section PDFKit document (header, symptoms, diagnosis, recommendations, red flags, facility card, disclaimer) and pipes it to the HTTP response | `analysis: object, res: ExpressResponse` | `void` (streams PDF) | `GET /history/:id/pdf` |

---

### `backend/utils/diseases/index.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `DISEASE_DB` | ~1 | Imports and flattens every category file below into one unified array; validates each entry against `_schema.js` in dev | — | `disease[]` array | `localDiagnosis.js` |

---

### Disease knowledge base (`backend/utils/diseases/`)

Every disease entry follows the schema documented in `backend/utils/diseases/_schema.js`:

```js
{
  id, name, category, aliases,
  symptoms: { primary: [{name, weight, description}], secondary: [...], differentiating: [...] },
  duration_patterns: { acute, typical, chronic },
  severity_levels:  { mild: {description, urgency}, moderate: {...}, severe: {...} },
  risk_factors, red_flags,
  specialist, india_prevalence, seasonal_pattern, age_relevance, gender_relevance,
  similar_diseases, recommendations,
}
```

Organised into 18 body-system directories so the knowledge base stays navigable as it grows — each `[cross-ref]` below means the condition is defined once (in its primary home) and matched from any related file's context rather than duplicated:

| Directory | Files | Covers |
|---|---|---|
| `infectious/` | `viral.js`, `bacterial.js`, `fungal.js`, `parasitic.js`, `tropical.js` | Influenza, dengue, chikungunya, COVID-19, measles, hepatitis A–E, typhoid, TB, cholera, malaria, filariasis, ringworm, candidiasis, and more |
| `respiratory/` | `upper.js`, `lower.js`, `chronic.js` | Sinusitis, tonsillitis, pneumonia, bronchitis, asthma, COPD, sleep apnea |
| `gastrointestinal/` | `upper_gi.js`, `lower_gi.js`, `liver.js`, `pancreas_gallbladder.js` | GERD, peptic ulcer, IBS, IBD, hepatitis/fatty liver, pancreatitis, gallstones |
| `cardiovascular/` | `heart.js`, `vascular.js` | Hypertension, coronary artery disease, arrhythmias, heart failure, DVT, PE |
| `neurological/` | `headache.js`, `central.js`, `peripheral.js` | Migraine, stroke warning signs, epilepsy, meningitis, sciatica, carpal tunnel |
| `musculoskeletal/` | `joints.js`, `bone.js`, `soft_tissue.js` | Osteoarthritis, rheumatoid arthritis, gout, osteoporosis, fibromyalgia |
| `endocrine/` | `diabetes.js`, `thyroid.js`, `adrenal_pituitary.js` | Diabetes (incl. DKA red flag), thyroid disorders, Cushing's, PCOS |
| `renal_urological/` | `kidney.js`, `urological.js` | Kidney stones, CKD, UTI, BPH, testicular torsion red flag |
| `dermatological/` | `infections.js`, `inflammatory.js`, `other_skin.js` | Cellulitis, eczema, psoriasis, acne, vitiligo, melanoma warning signs |
| `mental_health/` | `common.js` | Depression/anxiety screening indicators — always routes to "speak with a mental health professional", never a diagnosis |
| `hematological/` | `blood.js` | Anemia, thrombocytopenia, leukemia/lymphoma warning signs |
| `ent/` | `ear_nose_throat.js` | Otitis, vertigo, sudden hearing loss red flag |
| `ophthalmological/` | `eye.js` | Conjunctivitis, glaucoma warning, retinal detachment red flag |
| `gynecological/` | `women.js` | Endometriosis, PID, ectopic pregnancy and preeclampsia red flags |
| `pediatric_common/` | `children.js` | Hand-foot-mouth, croup, Kawasaki warning signs, childhood rashes |
| `allergic_immune/` | `allergy_autoimmune.js` | Allergic rhinitis, food allergy, anaphylaxis red flag, lupus |
| `emergency_red_flags/` | `red_flags.js` | Symptom *combinations* (chest pain + shortness of breath, sudden severe headache, etc.) that always resolve to `urgency: "emergency"` |

To add a disease: pick the right file, add an entry matching `_schema.js`, and it's picked up automatically by `diseases/index.js` — no other code changes needed.

---

### `frontend/src/api/client.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `client` (Axios instance) | ~5 | Pre-configured Axios with base URL, 30 s timeout, `withCredentials: true` | — | AxiosInstance | All service files |
| `getToken()` | ~20 | Reads JWT from localStorage | — | `string \| null` | Request interceptor |
| `setToken()` | ~25 | Saves JWT to localStorage and in-memory cache | `token: string` | `void` | Auth store actions |
| `clearToken()` | ~30 | Removes JWT from localStorage and in-memory cache | — | `void` | Response interceptor, logout |
| Request interceptor | ~40 | Attaches `Authorization: Bearer <token>` to every outgoing request | — | Modified request config | Axios internals |
| Response interceptor | ~55 | On 401: clears token, redirects to `/login` | — | Error or response | Axios internals |
| `normalizeError()` | ~70 | Converts Axios errors into plain `Error` objects with `.code`, `.status`, `.data` | `error: AxiosError` | `Error` | Service functions |

---

### `frontend/src/store/authStore.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `useAuthStore` (Zustand store) | ~5 | Global auth state: `user`, `token`, `isLoading`, `isInitialized` | — | Store hook | All components needing auth |
| `setAuth()` | ~30 | Saves `user` + `token` to Zustand state and localStorage | `user, token` | `void` | `login()`, `signup()` |
| `clearAuth()` | ~40 | Wipes user + token from store and localStorage | — | `void` | `logout()`, 401 interceptor |
| `login()` | ~50 | Calls `authService.login()` then `setAuth()` | `email, password` | `Promise<void>` | `LoginPage` |
| `signup()` | ~60 | Calls `authService.signup()` then `setAuth()` | `name, email, password` | `Promise<void>` | `SignupPage` |
| `forgotPassword()` | ~70 | Calls `authService.forgotPassword()` | `email` | `Promise<{ message }>` | `ForgotPasswordPage` |
| `resetPassword()` | ~80 | Calls `authService.resetPassword()` | `email, token, newPassword` | `Promise<void>` | `ResetPasswordPage` |
| `updateProfile()` | ~90 | Calls `authService.updateProfile()`, updates store `user` | `name, email` | `Promise<void>` | `EditProfilePage` |
| `logout()` | ~100 | Calls `authService.logout()` then `clearAuth()` | — | `Promise<void>` | `ProfilePage`, `SideDrawer` |
| `loadUser()` | ~110 | Bootstraps auth from localStorage on app mount | — | `Promise<void>` | `App.jsx` on mount |

---

### `frontend/src/services/authService.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `signup()` | ~5 | `POST /api/auth/signup` | `name, email, password` | `Promise<{ user, token }>` | `authStore.signup()` |
| `login()` | ~15 | `POST /api/auth/login` | `email, password` | `Promise<{ user, token }>` | `authStore.login()` |
| `forgotPassword()` | ~25 | `POST /api/auth/forgot-password` | `email` | `Promise<{ message }>` | `authStore.forgotPassword()` |
| `resetPassword()` | ~35 | `POST /api/auth/reset-password` | `email, token, newPassword` | `Promise<{ message }>` | `authStore.resetPassword()` |
| `getCurrentUser()` | ~45 | `GET /api/auth/me` | — | `Promise<safeUser>` | `authStore.loadUser()` |
| `updateProfile()` | ~55 | `PUT /api/auth/profile` | `name, email` | `Promise<safeUser>` | `authStore.updateProfile()` |
| `logout()` | ~65 | `POST /api/auth/logout` | — | `Promise<void>` | `authStore.logout()` |

---

### `frontend/src/services/apiService.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `analyzeSymptoms()` | ~5 | `POST /api/analyze` | `symptoms: string` | `Promise<diagnosisObject + analysisId>` | `HomePage` analyzing stage |
| `findBestDoctor()` | ~20 | `POST /api/find-doctor` | `lat, lng, specialty, analysisId?` | `Promise<{ bestMatch, alternativesCount }>` | `HomePage` searching stage |
| `geocodeCity()` | ~35 | `GET nominatim.openstreetmap.org/search?q={cityName}` — converts city name to lat/lng | `cityName: string` | `Promise<{ lat, lng, displayName }>` | `HomePage` location-error fallback |

---

### `frontend/src/services/historyService.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `saveAnalysis()` | ~10 | Creates entry in `localStorage` (max 50 entries); generates UUID | `{ symptoms, diagnosis, facility }` | Entry object | `HomePage` after analyze |
| `updateAnalysis()` | ~40 | Merges a patch into an existing localStorage entry | `id: string, patch: object` | Updated entry | `HomePage` after find-doctor |
| `getHistory()` | ~60 | Returns all localStorage entries, newest first | `page?, limit?` | `entry[]` | `HistoryPage` |
| `getAnalysis()` | ~80 | Looks up one entry by ID | `id: string` | Entry or `undefined` | `AnalysisDetailPage` |
| `deleteAnalysis()` | ~95 | Removes entry by ID from localStorage | `id: string` | `void` | `HistoryPage`, `AnalysisDetailPage` |
| `downloadReport()` | ~110 | Placeholder — throws; actual PDF goes through `/api/history/:id/pdf` | `id: string` | Throws | `AnalysisDetailPage` |
| `clearHistory()` | ~120 | Wipes all localStorage history entries | — | `void` | `ProfilePage` |

---

### `frontend/src/services/locationService.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `getCurrentLocation()` | ~10 | Acquires GPS: browser geolocation (with 5-min cache) → Capacitor native → IP-based (`ipapi.co`) | — | `Promise<{ lat, lng, accuracy, source }>` | `HomePage` locating stage |
| `clearLocationCache()` | ~60 | Clears the 5-minute GPS cache so the next call re-acquires | — | `void` | Retry flows |
| `isAndroidApp()` | ~70 | Returns `true` when running as a native Capacitor Android app | — | `boolean` | `locationService` internals |

---

### `frontend/src/services/rankingService.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `findBestMatch()` | ~5 | Client-side facility ranking (mirrors backend logic; currently unused — backend ranks) | `facilities[], specialty` | `{ bestFacility, bestDoctor, score, breakdown }` | Not currently called |

---

### `frontend/src/utils/generateReport.js`

| Name | Line | What It Does | Parameters | Returns | Called By |
|---|---|---|---|---|---|
| `buildHTML()` | ~5 | Generates a styled A4 HTML string including header, symptoms, diagnosis, confidence bar, recommendations, home care, red flags, differential diagnoses, facility card, and disclaimer; header and footer are `position:fixed` so they repeat on every printed page; all section cards have `break-inside:avoid` to prevent content cutting between pages | `diagnosis, symptoms, bestMatch` | `string` (HTML) | `generatePDF()` |
| `generatePDF()` | ~150 | On **web**: calls `buildHTML()`, creates a Blob, opens a new window, calls `window.print()` after 600 ms so the user can "Save as PDF". On **Android (Capacitor)**: fetches the server-generated PDFKit binary, saves to device cache, opens native share sheet | `{ diagnosis, symptoms, bestMatch, analysisId? }` | `void` | `BestMatchCard`, `AnalysisDetailPage` |

---

### `frontend/src/pages/HomePage.jsx`

| Name | Line | What It Does | Parameters | Returns |
|---|---|---|---|---|
| `INIT` constant | ~20 | Initial state for the page-level state machine | — | State object |
| `reducer()` | ~40 | Pure reducer; transitions: `ANALYZE` → `ANALYSIS_SUCCESS` → `LOCATION_SUCCESS` → `SEARCH_SUCCESS` | `state, action` | New state |
| Dashboard view | ~120 | Greeting, stats (total analyses, last check date), 3 recent analyses, CTA button | — | JSX |
| SymptomInput view | ~200 | Renders `<SymptomInput>`; dispatches `ANALYZE` on submit | — | JSX |
| AnalyzingLoader view | ~210 | Displayed while `analyzeSymptoms()` is in-flight | — | JSX |
| DiagnosisCard view | ~220 | Displayed after analysis; "Find Doctor" button triggers locate flow | — | JSX |
| LocationLoader / error view | ~240 | GPS spinner; city-search text input as fallback | — | JSX |
| BestMatchCard view | ~280 | Displayed after facility found; PDF download button | — | JSX |
| `useEffect` — analyze | ~320 | On stage `'analyzing'`: calls `analyzeSymptoms()`, saves to localStorage, dispatches | — | `void` |
| `useEffect` — locate | ~350 | On stage `'locating'`: calls `getCurrentLocation()`, dispatches | — | `void` |
| `useEffect` — search | ~380 | On stage `'searching'`: calls `findBestDoctor()`, updates localStorage entry, dispatches | — | `void` |

---

### `frontend/src/pages/HistoryPage.jsx`

| Name | Line | What It Does | Parameters | Returns |
|---|---|---|---|---|
| `HistoryPage` component | ~5 | Cursor-paginated list of all user analyses; tries `GET /api/history`, falls back to localStorage | — | JSX |
| `loadHistory()` | ~30 | Fetches next page from `GET /api/history?cursor=...&limit=20`; appends to displayed list | `cursor: string \| null` | `Promise<void>` |
| Delete handler | ~70 | Calls `DELETE /api/history/:id`; removes entry from local React state | `id: string` | `Promise<void>` |

---

### `frontend/src/pages/AnalysisDetailPage.jsx`

| Name | Line | What It Does | Parameters | Returns |
|---|---|---|---|---|
| `AnalysisDetailPage` component | ~5 | Full detail view; tries `GET /api/history/:id`, falls back to localStorage | — | JSX |
| PDF download handler | ~60 | Initiates `GET /api/history/:id/pdf` as a browser file download | — | `void` |
| Delete handler | ~80 | Calls `DELETE /api/history/:id`; navigates back | — | `Promise<void>` |

---

### `frontend/src/pages/ProfilePage.jsx`

| Name | Line | What It Does | Parameters | Returns |
|---|---|---|---|---|
| `ProfilePage` component | ~5 | Displays name, email, creation date; links to Edit Profile and full disclaimer | — | JSX |
| Logout handler | ~30 | Calls `authStore.logout()`; redirects to `/login` | — | `Promise<void>` |

---

### `frontend/src/pages/EditProfilePage.jsx`

| Name | Line | What It Does | Parameters | Returns |
|---|---|---|---|---|
| `EditProfilePage` component | ~5 | Form to update name (2–60 chars) and email | — | JSX |
| Submit handler | ~40 | Calls `authStore.updateProfile(name, email)`; navigates back on success; shows 409 error if email taken | `name, email` | `Promise<void>` |

---

### Auth Pages (`frontend/src/pages/auth/`)

| Component | File | What It Does |
|---|---|---|
| `LoginPage` | `LoginPage.jsx` | Email + password form; calls `authStore.login()`; links to `/signup` and `/forgot-password` |
| `SignupPage` | `SignupPage.jsx` | Name + email + password form with 4-level strength meter; calls `authStore.signup()` |
| `ForgotPasswordPage` | `ForgotPasswordPage.jsx` | Email input; calls `authStore.forgotPassword()`; shows "check your email" confirmation; no user-enumeration on 404 |
| `ResetPasswordPage` | `ResetPasswordPage.jsx` | Reads `?token=` + `?email=` from URL; new-password + confirm form; calls `authStore.resetPassword()` |

---

### React Components (`frontend/src/components/`)

| Component | File | What It Does | Key Props |
|---|---|---|---|
| `ProtectedRoute` | `ProtectedRoute.jsx` | Redirects to `/login` if user is not authenticated | `children` |
| `PublicRoute` | `PublicRoute.jsx` | Redirects to `/` if user is already authenticated | `children` |
| `AuthLayout` | `AuthLayout.jsx` | Centered white card with MediFind logo for all auth pages | `children` |
| `SideDrawer` | `SideDrawer.jsx` | Slide-in hamburger nav with Home / History / Profile / Sign Out | `open, onClose` |
| `SymptomInput` | `SymptomInput.jsx` | Textarea (10–2000 chars) + quick-chip buttons + character counter + submit | `onSubmit, error?` |
| `DiagnosisCard` | `DiagnosisCard.jsx` | Disease name, severity badge, urgency label, confidence bar, recommendations, red flags | `diagnosis, onFindDoctor, onReset` |
| `BestMatchCard` | `BestMatchCard.jsx` | Facility name, type badge, distance, phone (tap-to-call), address, score breakdown, OSM link, PDF download | `bestMatch, diagnosis, symptoms, analysisId?, onSearchAgain` |
| `AnalyzingLoader` | `AnalyzingLoader.jsx` | Spinning teal stethoscope shown while AI processes | `message?` |
| `LocationLoader` | `LocationLoader.jsx` | Pulsing map-pin shown while acquiring GPS | — |
| `EmergencyBanner` | `EmergencyBanner.jsx` | Red banner with dial-able 911/112/108 buttons; shown when urgency is `emergency` | `symptoms, diagnosis` |
| `MedicalDisclaimerBanner` | `MedicalDisclaimerBanner.jsx` | Small amber disclaimer strip | — |
| `MedicalDisclaimerFull` | `MedicalDisclaimerFull.jsx` | Full-screen expandable legal disclaimer text | `open, onClose` |
| `ErrorCard` | `ErrorCard.jsx` | Generic error display with optional retry button | `error, onRetry?` |
| `Loader` | `Loader.jsx` | Full-page loading spinner used during auth initialization | — |

---

### UI Primitives (`frontend/src/components/ui/`)

| Component | File | What It Does | Key Props |
|---|---|---|---|
| `Button` | `Button.jsx` | Tailwind button; variants: `primary`, `ghost`, `danger`; shows `<Spinner>` and disables on `isLoading` | `variant, size, isLoading, children` |
| `Input` | `Input.jsx` | iOS-style input with optional left icon, right element, error text | `placeholder, value, onChange, leftIcon?, rightElement?, error?` |
| `PasswordInput` | `PasswordInput.jsx` | `Input` with show/hide eye icon toggle | Same as `Input` |
| `Card` | `Card.jsx` | iOS-style white card container | `title?, footer?, children` |
| `Badge` | `Badge.jsx` | Small colored label; variants match severity/status values | `variant, children` |
| `Spinner` | `Spinner.jsx` | Animated CSS circle loader | `size?: 'sm' \| 'md' \| 'lg'` |
| `TopBar` | `TopBar.jsx` | Sticky glass-blur top navigation bar | `title, leftAction?, rightAction?` |
| `BottomSheet` | `BottomSheet.jsx` | Slides up from bottom on mobile; scales in as modal on desktop; click scrim to close | `open, onClose, children` |
| `EmptyState` | `EmptyState.jsx` | Icon + title + optional message + optional action button for empty lists | `icon?, title, message?, actionText?, onAction?` |
| `ConfirmDialog` | `ConfirmDialog.jsx` | Modal confirmation dialog with cancel and confirm (optionally red) buttons | `title, message, confirmText?, cancelText?, isDangerous?, onConfirm, onCancel` |

---

## 🗺️ Architecture Map

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │               FRONTEND  (React 18 + Vite)                  │  │
│  │                                                            │  │
│  │  ┌───────────────┐    ┌───────────────────────────────┐   │  │
│  │  │ Zustand Auth  │◄──►│     Pages / Components        │   │  │
│  │  │     Store     │    │  HomePage  HistoryPage         │   │  │
│  │  └──────┬────────┘    │  ProfilePage  Auth Pages       │   │  │
│  │         │             └──────────────┬────────────────┘   │  │
│  │         │                            │                     │  │
│  │         ▼                            ▼                     │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                   Services Layer                     │  │  │
│  │  │   authService   apiService   historyService          │  │  │
│  │  │   locationService   rankingService                   │  │  │
│  │  └──────────────────────┬───────────────────────────────┘  │  │
│  │                         │                                   │  │
│  │              ┌──────────▼──────────┐                        │  │
│  │              │   api/client.js     │  ← JWT interceptors     │  │
│  │              │  (Axios, 30s timeout│                        │  │
│  │              │   withCredentials)  │                        │  │
│  │              └──────────┬──────────┘                        │  │
│  └─────────────────────────┼──────────────────────────────────┘  │
│                            │                                      │
│  ┌─────────────────────────┼──────────────────────────────────┐   │
│  │           localStorage  (dual-write history)               │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────┘
                             │  HTTPS REST API
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                  BACKEND  (Express / Node.js)                    │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │               Middleware Stack                               │  │
│ │  helmet   compression   cors   rate-limit   cookie-parser   │  │
│ └──────────────────────────────────────────────────────────── ┘  │
│                                                                  │
│ ┌──────────┐ ┌──────────┐ ┌────────────────┐ ┌──────────────┐   │
│ │  /auth   │ │ /analyze │ │  /find-doctor  │ │   /history   │   │
│ └────┬─────┘ └────┬─────┘ └───────┬────────┘ └──────┬───────┘   │
│      │            │               │                  │            │
│      │     ┌──────▼──────┐  ┌─────▼──────┐          │            │
│      │     │ Cache Layer  │  │  Ranking   │          │            │
│      │     │ Redis / LRU  │  │haversine() │          │            │
│      │     └──────┬──────┘  │scoreFacility│          │            │
│      │            │         └─────┬──────┘          │            │
│      │     ┌──────▼──────┐        │                  │            │
│      │     │localDiagnose│        │                  │            │
│      │     │(in-process, │        │                  │            │
│      │     │no network)  │        │                  │            │
│ ┌────▼─────▼─────────────▼────────▼──────────────────▼────────┐  │
│ │         requireAuth()  validate()  middleware                 │  │
│ └──────────────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────┬────────────────────────────┘
                 │                    │
    ┌────────────▼────────┐  ┌────────▼──────────────────────────┐
    │  PostgreSQL (local)  │  │  External APIs                    │
    │  User model         │  │  (mapping / geocoding only —      │
    │  Analysis model     │  │   diagnosis never leaves the server)│
    └─────────────────────┘  │                                   │
                             │  ┌────────────────────────────┐   │
                             │  │  OSM Overpass API          │   │
                             │  │  5 km → 15 km radius       │   │
                             │  └────────────────────────────┘   │
                             │  ┌────────────────────────────┐   │
                             │  │  Nominatim (geocoding)     │   │
                             │  │  city name → lat/lng       │   │
                             │  └────────────────────────────┘   │
                             │  ┌────────────────────────────┐   │
                             │  │  ipapi.co (IP geolocation) │   │
                             │  │  GPS fallback              │   │
                             │  └────────────────────────────┘   │
                             └───────────────────────────────────┘

DATA FLOW — full analysis + doctor search:

User types symptoms
      │
      ▼
SymptomInput.jsx → dispatch ANALYZE
      │
      ▼
analyzeSymptoms() [apiService]  →  POST /api/analyze
      │
      ├─ Cache hit? ──YES──► return cached result immediately
      │
      NO
      │
      ▼
localDiagnose() [tokenize → extract features → score DISEASE_DB → rank top 3, ~1-5 ms]
      │
      ▼
adaptToApiResponse() [maps engine shape → stable public API JSON shape]
      │
      ▼
applyIndiaPatternCrossCheck()
      │
      ▼
stripMedicineRecommendations()
      │
      ▼
cacheSet()  +  prisma.analysis.create()
      │
      ▼
Response to frontend
      │
      ├── saveAnalysis() [localStorage, immediate]
      │
      ▼
dispatch ANALYSIS_SUCCESS → DiagnosisCard renders

User clicks "Find Doctor"
      │
      ▼
getCurrentLocation() → browser GPS → Capacitor → ipapi.co
      │
      ▼
dispatch LOCATION_SUCCESS → stage = 'searching'
      │
      ▼
findBestDoctor() → POST /api/find-doctor
      │
      ▼
queryOverpass() at 5 km … expand to 15 km if empty
      │
      ▼
scoreFacility() for each result [haversine + specialty + type + completeness]
      │
      ▼
Best match → prisma.analysis.update() + localStorage updateAnalysis()
      │
      ▼
dispatch SEARCH_SUCCESS → BestMatchCard renders
```

---

## 🍼 Baby-Proof Setup Guide

### 🔧 Step 0 — What You Need to Install First

---

#### How to open a terminal

- **Windows:** Press the `Windows` key, type `PowerShell`, press `Enter`. A dark window opens.
- **Mac:** Press `Cmd + Space`, type `Terminal`, press `Enter`.
- **Linux:** Press `Ctrl + Alt + T`.

Keep this window open for all the commands below.

---

#### Tool 1: Node.js (**REQUIRED**)

**What it is:** Node.js is the engine that runs the backend server on your computer.

**Download:** Open your browser and navigate to:
```
https://nodejs.org
```

**What to click:** Click the large green **"LTS"** button (it says "Recommended For Most Users"). Do NOT click the "Current" button.

**During install:** Accept all default options. When you see a checkbox labelled "Add to PATH", make sure it is **checked**. Click through all screens accepting defaults.

**Verify it worked:** Type this in your terminal and press `Enter`:
```bash
node --version
```
You should see output like `v20.11.0`. Any number starting with `v18`, `v20`, or `v22` means success. Also run:
```bash
npm --version
```
You should see something like `10.2.4`.

---

#### Tool 2: Git (**REQUIRED**)

**What it is:** Git downloads the project code from the internet to your computer.

**Download:**
```
https://git-scm.com/downloads
```

**What to click:** Click the download button matching your operating system (Windows / macOS / Linux). During the Windows installer, when it asks "Adjusting your PATH environment", select **"Git from the command line and also from 3rd-party software"**. Accept all other defaults.

**Verify it worked:**
```bash
git --version
```
You should see `git version 2.x.x`.

---

#### Tool 3: PostgreSQL (local install) (**REQUIRED**)

**What it is:** MediFind stores user accounts and analysis history in a local PostgreSQL database running on your machine.

1. Open your browser and go to `https://www.postgresql.org/download/` and download the installer for your OS.
2. Run the installer. When it asks for a **password for the `postgres` superuser**, set one and write it down — you will need it in Step 2.
3. Accept all other defaults (default port is **5432**).
4. After installation finishes, open **pgAdmin** (installed alongside PostgreSQL) or open a terminal and run:
   ```bash
   psql -U postgres
   ```
5. Create the MediFind database:
   ```sql
   CREATE DATABASE medifind;
   \q
   ```
6. Your connection string will look like:
   ```
   postgresql://postgres:yourpassword@localhost:5432/medifind
   ```
   Replace `yourpassword` with the password you set in step 2.

> ⚠️ **WARNING:** Keep this connection string private. Never commit it to Git or share it publicly.
> 💡 **TIP:** On Windows you can also verify PostgreSQL is running by opening Task Manager → Services and confirming `postgresql-x64-*` shows **Running**.

---

### 📥 Step 1 — Get the Code

Type each command below, pressing `Enter` after each one.

**Navigate to your Desktop** (or any folder you prefer):
```bash
cd Desktop
```

**Download the project:**
```bash
git clone https://github.com/MANIBAALAKRISHNANS/MediFind.git
```

**Move into the project folder:**
```bash
cd MediFind
```

**Confirm success:** Run `ls` (Mac/Linux) or `dir` (Windows). You should see `backend` and `frontend` folders listed.

---

### ⚙️ Step 2 — Configure Environment (Fill In Your Secrets)

Environment files (`.env`) store secret values separately from the code so they are never accidentally uploaded to GitHub.

---

**Create the backend `.env` file:**

```bash
cd backend
```

On Mac/Linux:
```bash
cp .env.example .env
```

On Windows PowerShell:
```bash
Copy-Item .env.example .env
```

Open the new `backend/.env` file in any text editor (Notepad, VS Code, etc.) and fill in the values:

```env
# ─── REQUIRED ──────────────────────────────────────────────

# Your local PostgreSQL connection string (Tool 3 above)
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/medifind

# A secret used to sign login tokens — make up any long random string
# Run this to generate one:  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=paste-a-long-random-string-here

# ─── OPTIONAL (leave as-is for local development) ──────────

PORT=5000
NODE_ENV=development
SUPPORT_EMAIL=your-email@example.com
FRONTEND_URL=http://localhost:5173

# Email for password reset — leave blank in dev mode.
# Reset links will print to the terminal console instead.
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=MediFind <noreply@medifind.com>

# Redis — leave blank to use in-memory cache
REDIS_URL=

CORS_ORIGIN=https://localhost,capacitor://localhost,https://localhost:5173
```

**Every variable explained:**

| Variable | What it is | Where to get it |
|---|---|---|
| `DATABASE_URL` | Local PostgreSQL connection string — `postgresql://postgres:PASSWORD@localhost:5432/medifind` | Step 0, Tool 3 |
| `JWT_SECRET` | Secret for signing login tokens; make up any 32+ character random string | Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | Port the backend listens on; `5000` is the default | Leave as `5000` |
| `NODE_ENV` | `development` enables dev-only features like printing reset links to console | Leave as `development` |
| `SUPPORT_EMAIL` | Contact email shown in the app | Your email address |
| `FRONTEND_URL` | Frontend origin; used to build password reset links | `http://localhost:5173` for local dev |
| `SMTP_*` | Email settings for sending real password-reset emails | Leave blank; dev mode logs link to terminal |
| `REDIS_URL` | Optional Redis connection; improves caching across processes | Leave blank to use in-memory cache |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins | `https://localhost,capacitor://localhost,https://localhost:5173` for local dev |

---

**Create the frontend `.env` file:**

```bash
cd ../frontend
```

On Mac/Linux:
```bash
cp .env.example .env
```

On Windows PowerShell:
```bash
Copy-Item .env.example .env
```

Open `frontend/.env` and confirm it contains:
```env
VITE_API_URL=http://localhost:5000
```

This tells the frontend where to find the backend server during development.

---

**Go back to the project root:**
```bash
cd ..
```

---

### 📦 Step 3 — Install Dependencies

**Install root-level tools:**
```bash
npm install
```
This takes about 10–20 seconds. It installs `concurrently`, which lets you run both servers at once.

**Install backend dependencies:**
```bash
cd backend && npm install
```
This takes about 30–60 seconds. It downloads Express, Prisma, and all other backend packages.

**Install frontend dependencies:**
```bash
cd ../frontend && npm install
```
This takes about 60–120 seconds. It downloads React, Vite, Tailwind CSS, Capacitor, and all frontend packages.

**Return to root and set up the database tables:**
```bash
cd .. && cd backend && npx prisma migrate deploy
```
This creates the `User` and `Analysis` tables in your local PostgreSQL database. Success looks like:
```
All migrations have been successfully applied.
```

**Return to root:**
```bash
cd ..
```

---

**Top 3 install errors and fixes:**

| Error message | Cause | Fix |
|---|---|---|
| `npm: command not found` | Node.js not installed or not on PATH | Re-run Step 0, Tool 1. Restart your terminal after installing. |
| `EACCES: permission denied` | Insufficient write permissions | Mac/Linux: prefix the command with `sudo`. Windows: right-click PowerShell → "Run as administrator". |
| `Cannot find module 'prisma'` | Backend packages not installed | Run `cd backend && npm install`, then retry the migrate command. |

---

### ▶️ Step 4 — Run the Project

From the project root, run:
```bash
npm run dev
```

This starts both servers simultaneously:
- **Backend** at `http://localhost:5000`
- **Frontend** at `http://localhost:5173`

**What the terminal output means:**
```
[backend] 🚀 MediFind API running on http://localhost:5000   ← backend is ready
[backend] ✅ PostgreSQL connected                            ← database connection OK
[frontend] Local:  http://localhost:5173/                   ← frontend URL to open
[frontend] ready in 1200ms                                  ← build completed
```

**Open the app:** Go to this URL in your browser:
```
http://localhost:5173
```

You should see a teal MediFind login screen.

> ⚠️ **WARNING:** If you see "EADDRINUSE: address already in use :5000", another process is already using port 5000. Open Task Manager (Windows) or run `lsof -i :5000` (Mac/Linux) and stop the conflicting process.
> 💡 **TIP:** Press `Ctrl + C` in the terminal to stop both servers.

---

### ✅ Step 5 — Verify Everything Works (Smoke Test Checklist)

Follow these steps in your browser in order:

- [ ] **1. App loads.** Open `http://localhost:5173`. The MediFind login screen appears with a teal logo.
- [ ] **2. Sign up works.** Click "Create Account". Enter any name, email, and a password with at least 8 characters (must include a letter and a number). Click "Sign Up". You land on the home dashboard.
- [ ] **3. Symptom analysis works.** Click "Start Analysis". Type: `I have a fever of 38 degrees, headache, body aches, and fatigue for 2 days`. Click "Analyze Symptoms". The local engine responds almost instantly (no external API round-trip) with a diagnosis card showing a disease name, severity, and recommendations.
- [ ] **4. Emergency banner (optional).** Type symptoms including "chest pain" and "shortness of breath". A red emergency banner should appear with phone numbers.
- [ ] **5. Doctor finder works.** On the diagnosis card, click "Find Best Doctor Near Me". Allow location access when the browser asks. After a few seconds, a facility card appears with a name, distance, and address.
- [ ] **6. PDF works.** On the facility card, click "Download Report". A print dialog opens. Click Cancel (this confirms the PDF generation worked).
- [ ] **7. History works.** Open the side menu (hamburger icon). Click "History". Your recent analysis appears in the list.
- [ ] **8. Detail view works.** Click the analysis in the list. The full diagnosis and facility card appear.
- [ ] **9. Logout works.** Open the menu, click "Profile", then "Sign Out". You return to the login page.
- [ ] **10. Login works.** Log back in with the same email and password. You return to the home screen.

All 10 checks passing means MediFind is fully operational.

---

## 🚨 Common Errors & Fixes

| # | Error | Cause | Exact Fix |
|---|---|---|---|
| 1 | Every analysis returns "Unspecified Condition" with low confidence | Symptom text too vague, or doesn't match any disease's ≥2 primary symptoms | Describe symptoms more specifically (e.g. "fever, cough, sore throat" rather than "feeling unwell") |
| 2 | `Can't reach database server` / Prisma P1001 | PostgreSQL service not running or wrong credentials | On Windows: open Task Manager → Services → confirm `postgresql-x64-*` shows **Running**. Verify the password and database name in `backend/.env` match your PostgreSQL installation. |
| 3 | `PrismaClientInitializationError` — table does not exist | Migrations not run | Run `cd backend && npx prisma migrate deploy` |
| 4 | `Network Error` in browser console on every API call | Backend server not running | Open a new terminal, run `cd backend && npm run dev`, wait for "MediFind API running" |
| 5 | `CORS error — blocked by CORS policy` | Frontend origin not allowed by backend | Set `CORS_ORIGIN=https://localhost,https://localhost:5173` in `backend/.env` and restart the backend |
| 6 | `401 Unauthorized` on every authenticated request | JWT_SECRET changed since last login, or token expired | Open browser DevTools → Application → Local Storage → delete all `medifind_*` keys → log in again |
| 7 | Same symptom text keeps re-running the full scoring pass instead of hitting cache | Redis not configured and in-memory cache was cleared by a server restart | Expected without `REDIS_URL` set — the in-memory cache doesn't survive restarts. Set `REDIS_URL` to persist cache across restarts/instances. |
| 8 | Location shows "Permission denied" | Browser blocked GPS access | Click the lock icon in the address bar → reset Location to "Allow" → refresh the page |
| 9 | `npm install` hangs or shows network errors | Corporate proxy or firewall | Run `npm config set registry https://registry.npmjs.org/`, then retry |
| 10 | PDF download opens a blank page | Browser pop-up blocker active | Open browser settings → allow pop-ups for `localhost:5173` |

---

## 📁 Project File Structure

```
medifind/                              ← Project root (monorepo workspace)
├── package.json                       ← Root scripts; "dev" runs both servers via concurrently
├── README.md                          ← This file
│
├── backend/                           ← Node.js / Express REST API
│   ├── package.json                   ← Backend dependencies (Express, Prisma, PDFKit, etc.)
│   ├── server.js                      ← App entry: middleware stack, route mounting, listen()
│   ├── db.js                          ← Singleton PrismaClient; one DB connection shared across app
│   ├── .env                           ← Secret config (API keys, DB URL) — never commit this
│   ├── .env.example                   ← Template with all required variable names and no real values
│   │
│   ├── prisma/
│   │   └── schema.prisma              ← Database schema: User + Analysis models; Analysis stores full score breakdown (matchSpecialtyScore, matchDistanceScore, matchTypeScore, matchCompletenessScore)
│   │
│   ├── routes/
│   │   ├── auth.js                    ← /signup /login /forgot-password /reset-password /me /profile /logout
│   │   ├── analyze.js                 ← /analyze — local diagnosis engine + India cross-check (no external calls)
│   │   ├── findDoctor.js              ← /find-doctor — Overpass query + multi-factor facility ranking
│   │   ├── history.js                 ← /history — list (cursor-paginated), detail, delete, PDF download
│   │   └── health.js                  ← /health — liveness probe returning { status: 'ok' }
│   │
│   ├── middleware/
│   │   ├── auth.js                    ← requireAuth() — JWT from cookie or Bearer header
│   │   └── validate.js                ← validate(schema) — Joi body validation middleware factory
│   │
│   └── utils/
│       ├── password.js                ← hashPassword() and comparePassword() using bcryptjs
│       ├── token.js                   ← generateToken() — signs 7-day JWTs
│       ├── userSafe.js                ← toSafeUser() — strips password/reset fields before API response
│       ├── ranking.js                 ← haversine(), scoreFacility(), findBestMatch()
│       ├── pdfReport.js               ← generateReportPDF() — server-side PDFKit report generation
│       ├── cache.js                   ← cacheGet() / cacheSet() — Redis → in-memory LRU fallback
│       ├── localDiagnosis.js          ← localDiagnose() — weighted rule-based scoring across DISEASE_DB (primary + only diagnosis engine)
│       ├── indianDiseasePatterns.js   ← detectPatterns() — 96 India-specific symptom patterns
│       ├── nlp/                       ← Text pipeline feeding localDiagnose()
│       │   ├── synonyms.js            ← 200+ colloquial/Indian-English symptom synonym map
│       │   ├── tokenizer.js           ← normalize() / tokenize() — lowercase, strip punctuation, apply synonyms
│       │   ├── durationParser.js      ← parseDuration() — "for 2 days" → { days, category }
│       │   ├── severityParser.js      ← parseSeverity() — detects "severe" / "mild" / "can't breathe" qualifiers
│       │   └── negationDetector.js    ← detectNegations() — "no fever", "without rash"
│       └── diseases/                  ← Disease knowledge base (18 body-system directories)
│           ├── index.js               ← Aggregates every category file into one DISEASE_DB export
│           ├── _schema.js             ← DiseaseEntry shape + lightweight dev-time validator
│           ├── infectious/            ← viral.js, bacterial.js, fungal.js, parasitic.js, tropical.js
│           ├── respiratory/           ← upper.js, lower.js, chronic.js
│           ├── gastrointestinal/      ← upper_gi.js, lower_gi.js, liver.js, pancreas_gallbladder.js
│           ├── cardiovascular/        ← heart.js, vascular.js
│           ├── neurological/          ← headache.js, central.js, peripheral.js
│           ├── musculoskeletal/       ← joints.js, bone.js, soft_tissue.js
│           ├── endocrine/             ← diabetes.js, thyroid.js, adrenal_pituitary.js
│           ├── renal_urological/      ← kidney.js, urological.js
│           ├── dermatological/        ← infections.js, inflammatory.js, other_skin.js
│           ├── mental_health/         ← common.js
│           ├── hematological/         ← blood.js
│           ├── ent/                   ← ear_nose_throat.js
│           ├── ophthalmological/      ← eye.js
│           ├── gynecological/         ← women.js
│           ├── pediatric_common/      ← children.js
│           ├── allergic_immune/       ← allergy_autoimmune.js
│           └── emergency_red_flags/   ← red_flags.js — symptom combos that always force urgency: "emergency"
│
└── frontend/                          ← React SPA (also wraps to Android APK via Capacitor)
    ├── package.json                   ← Frontend dependencies (React, Vite, Tailwind, Capacitor, etc.)
    ├── vite.config.js                 ← Vite build config; proxies /api calls to backend in dev
    ├── tailwind.config.js             ← Custom design tokens: medical teal palette, iOS shadows, animations
    ├── postcss.config.js              ← Required by Tailwind: PostCSS plugin chain
    ├── capacitor.config.json          ← Capacitor settings: appId, appName, Android server URL
    ├── index.html                     ← Single HTML shell; React mounts inside <div id="root">
    ├── .env                           ← VITE_API_URL for development
    ├── .env.example                   ← Frontend env template
    ├── .env.production                ← VITE_API_URL for production build
    │
    └── src/
        ├── main.jsx                   ← React entry: wraps <App> in BrowserRouter + Capacitor init
        ├── App.jsx                    ← Root: route definitions, auth bootstrap on mount, Toaster
        ├── index.css                  ← Global CSS: Tailwind directives + ios-card, glass-bar, etc.
        ├── constants.js               ← TOKEN_KEY = 'medifind_token' (localStorage key name)
        │
        ├── api/
        │   └── client.js              ← Axios instance: JWT interceptor, 401 auto-logout, normalizeError()
        │
        ├── store/
        │   └── authStore.js           ← Zustand: user, token, login, signup, logout, loadUser
        │
        ├── utils/
        │   └── generateReport.js      ← buildHTML() + generatePDF() — client-side HTML print to PDF
        │
        ├── services/
        │   ├── authService.js         ← Thin wrappers: signup, login, forgotPassword, updateProfile
        │   ├── apiService.js          ← analyzeSymptoms(), findBestDoctor(), geocodeCity()
        │   ├── historyService.js      ← localStorage CRUD: saveAnalysis, getHistory, deleteAnalysis
        │   ├── locationService.js     ← GPS: browser → Capacitor → IP geolocation fallback chain
        │   ├── rankingService.js      ← Client-side facility ranking (mirrors backend; currently unused)
        │   ├── claudeService.js       ← Placeholder for future Claude AI integration
        │   └── placesService.js       ← Placeholder for future Google Places integration
        │
        ├── components/
        │   ├── ProtectedRoute.jsx     ← Redirects unauthenticated users to /login
        │   ├── PublicRoute.jsx        ← Redirects authenticated users to /
        │   ├── AuthLayout.jsx         ← White card + logo wrapper for auth pages
        │   ├── SideDrawer.jsx         ← Slide-in hamburger nav menu
        │   ├── SymptomInput.jsx       ← Textarea + chip shortcuts + character counter + submit
        │   ├── DiagnosisCard.jsx      ← AI result: disease, severity, urgency, recommendations, red flags
        │   ├── BestMatchCard.jsx      ← Facility card: score breakdown, OSM link, PDF download
        │   ├── AnalyzingLoader.jsx    ← Spinner shown while the local engine processes
        │   ├── LocationLoader.jsx     ← Pulsing map pin shown during GPS acquisition
        │   ├── EmergencyBanner.jsx    ← Red alert with tap-to-call emergency numbers
        │   ├── MedicalDisclaimerBanner.jsx ← Small amber disclaimer strip
        │   ├── MedicalDisclaimerFull.jsx   ← Full-screen legal disclaimer text
        │   ├── ErrorCard.jsx          ← Generic error display with optional retry
        │   ├── Loader.jsx             ← Full-page spinner during auth init
        │   └── ui/                    ← Design-system primitives
        │       ├── Button.jsx         ← primary / ghost / danger variants; loading state
        │       ├── Input.jsx          ← iOS-style input with icons and error text
        │       ├── PasswordInput.jsx  ← Input with show/hide toggle
        │       ├── Card.jsx           ← White card container
        │       ├── Badge.jsx          ← Severity/status color labels
        │       ├── Spinner.jsx        ← Animated circular loader (sm/md/lg)
        │       ├── TopBar.jsx         ← Sticky glass-blur navigation bar
        │       ├── BottomSheet.jsx    ← Mobile slide-up sheet / desktop modal
        │       ├── EmptyState.jsx     ← Empty list placeholder
        │       └── ConfirmDialog.jsx  ← Destructive-action confirmation modal
        │
        └── pages/
            ├── HomePage.jsx           ← Main flow: input → analyzing → diagnosis → locating → result
            ├── HistoryPage.jsx        ← Cursor-paginated analysis list with delete
            ├── AnalysisDetailPage.jsx ← Full analysis view with PDF download and delete
            ├── ProfilePage.jsx        ← User info, logout, links to edit and disclaimer
            ├── EditProfilePage.jsx    ← Update name/email form
            └── auth/
                ├── LoginPage.jsx      ← Email + password login
                ├── SignupPage.jsx     ← Registration with password strength meter
                ├── ForgotPasswordPage.jsx ← Trigger password reset email
                └── ResetPasswordPage.jsx  ← Set new password via emailed token
```

---

## 📚 Key Concepts Glossary

| Term | Plain-English Explanation |
|---|---|
| **API (Application Programming Interface)** | A defined way for two programs to talk to each other. The frontend sends a request to a URL; the backend reads it, does some work, and sends back a response — like a waiter passing orders between customers and the kitchen. |
| **REST API** | A style of API that uses standard web verbs (`GET` to read, `POST` to create, `PUT` to update, `DELETE` to remove) and URLs to describe what action to perform. |
| **JWT (JSON Web Token)** | A compact digital ID card your browser receives after logging in. It contains your user ID, is cryptographically signed so it cannot be forged, and is sent with every future request so the server knows who you are. |
| **HttpOnly Cookie** | A special storage slot in your browser that JavaScript cannot read — only the browser itself sends it automatically. This protects your login token from being stolen by malicious scripts on the page. |
| **Bcrypt** | A one-way scrambling function for passwords. After scrambling, the original password cannot be recovered — only compared. If the database is leaked, attackers still cannot learn your password. |
| **Prisma** | A tool that lets JavaScript code talk to the database using typed objects instead of raw SQL queries. It also tracks database structure changes over time via migrations. |
| **PostgreSQL** | A powerful, open-source relational database — like a very well-organised spreadsheet on a server. It stores MediFind's user accounts and analysis history. |
| **Local PostgreSQL** | An open-source relational database installed directly on your machine (or the deployment server). MediFind uses it to store user accounts and analysis history. The deployment team installs PostgreSQL, creates the `medifind` database, and runs `npx prisma migrate deploy` to create all tables. |
| **React** | A JavaScript library for building user interfaces. It breaks the UI into reusable pieces called components (Button, Card, DiagnosisCard, etc.) and updates only the parts that change when data updates. |
| **Vite** | A build tool that compiles React JSX into browser-readable JavaScript and provides a dev server with instant hot-reload (changes appear in the browser without a full refresh). |
| **Tailwind CSS** | A CSS framework where you style elements by adding small class names directly in the HTML/JSX (e.g., `text-red-500 font-bold`), instead of writing separate CSS files. |
| **Zustand** | A minimal state management library for React. It works like a shared box that any component can read from or write to — used here to store the logged-in user's details. |
| **Capacitor** | A tool that wraps a web app (HTML/JS/CSS) inside a native Android or iOS shell, so it can access device hardware (GPS, camera) and be distributed as an APK. |
| **Axios** | A JavaScript library for making HTTP requests. It simplifies sending data to and receiving data from APIs, and supports request/response interceptors for adding auth headers automatically. |
| **Rule-based engine** | A system that makes decisions using explicit, human-written rules (weighted symptom matches, thresholds, scoring formulas) rather than a trained machine-learning model. Every match MediFind produces can be traced back to a specific disease definition and score — there is no black-box model to audit. |
| **Weighted scoring** | MediFind's matching approach: each symptom in a disease definition carries a `weight` (0–1) reflecting how characteristic it is. Matching a high-weight symptom contributes more points than a low-weight one, and primary/secondary/differentiating symptom tiers are weighted differently again. |
| **Overpass API** | A free API for querying OpenStreetMap map data. MediFind uses it to find nearby hospitals, clinics, and doctors by sending a geographical query with a radius. |
| **OpenStreetMap (OSM)** | A free, community-built map of the entire world — like Wikipedia but for maps. The Overpass API serves queries against this dataset. |
| **Haversine Formula** | A mathematical formula that computes the straight-line distance between two GPS coordinates on the surface of the Earth, accounting for the Earth's curvature. Used to rank facilities by distance. |
| **Redis** | An in-memory key-value store used as a high-speed cache. When Redis is connected, repeated symptom queries return an instant cached result instead of re-running the full scoring pass. |
| **LRU Cache** | "Least Recently Used" — an in-memory dictionary that keeps up to 500 recent diagnosis results. When it is full and a new entry arrives, it evicts the oldest unused entry. Used as the Redis fallback. |
| **Cursor Pagination** | A pagination style where instead of page numbers, you pass the ID of the last item you received. The server returns the next batch of items after that ID. More reliable than offset-based pagination when data changes frequently. |
| **PDFKit** | A Node.js library that draws PDF documents programmatically — placing text, shapes, and colors at precise positions — then streams the result directly to the HTTP response. |
| **Differential Diagnosis** | A list of alternative conditions ranked by likelihood. Because symptoms often match more than one disease, MediFind returns the top match plus up to 3 alternatives with confidence percentages. |
| **Severity** | How serious the identified condition is: `mild` (minor, home care is appropriate), `moderate` (should see a doctor within days), `severe` (needs prompt medical attention). |
| **Urgency** | How quickly the user should act: `self-care` (rest at home), `see-doctor-soon` (within a week), `see-doctor-today` (within 24 hours), `emergency` (go to ER immediately or call 108/112). |
| **Monorepo** | A single repository containing multiple distinct sub-projects — here, `backend/` and `frontend/` share one `medifind/` root folder, allowing shared scripts and simpler dependency management. |
| **Environment Variables (.env)** | A file that holds secret configuration values (API keys, database URLs, passwords) separately from source code. Never committed to version control. |
| **Hot Module Replacement (HMR)** | A Vite feature where only the specific module you just edited is swapped in the running browser tab — no full reload, no lost state. This makes frontend development very fast. |
| **Middleware** | A function that runs between an HTTP request arriving and the route handler processing it. MediFind middleware handles: JWT authentication, input validation, rate limiting, security headers, and response compression. |

---

## 🤝 Contributing & Development Workflow

### Prerequisites

- Node.js v18+ installed
- Git installed
- A fork of the repository on your GitHub account

---

### 1. Fork and Clone

**Fork** the repository on GitHub by clicking the "Fork" button at the top-right of the repo page. Then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/MediFind.git
cd MediFind
```

Add the original repository as `upstream` so you can pull future updates:

```bash
git remote add upstream https://github.com/MANIBAALAKRISHNANS/MediFind.git
```

---

### 2. Create a Feature Branch

Never work directly on `main`. Create a new branch for every feature or fix:

```bash
git checkout -b feature/your-feature-name
```

**Naming conventions:**

| Prefix | When to use |
|---|---|
| `feature/` | New capability (e.g., `feature/add-dark-mode`) |
| `fix/` | Bug fix (e.g., `fix/duration-parser-off-by-one`) |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring, no behavior change |

---

### 3. Set Up and Run

Follow the full Baby-Proof Setup Guide above (Steps 0–5). Use `.env.example` files to create your `.env` files.

---

### 4. Make Changes

**Backend changes:** Edit files in `backend/`. The dev server restarts automatically when you save.

**Frontend changes:** Edit files in `frontend/src/`. The browser updates instantly via HMR.

**Database schema changes:** Edit `backend/prisma/schema.prisma`, then run:
```bash
cd backend && npx prisma migrate dev --name describe-your-change
```

---

### 5. Adding a New Disease to the Local Engine

1. Open the appropriate category file under [backend/utils/diseases/](backend/utils/diseases/) (e.g. `respiratory/lower.js`) — see the directory table in the Reference section above for where a given condition belongs.
2. Add a disease object following the exact `DiseaseEntry` schema documented in [backend/utils/diseases/_schema.js](backend/utils/diseases/_schema.js) (primary/secondary/differentiating symptoms with weights, severity levels, red flags, recommendations, etc.).
3. If you created a brand-new file, import and spread it in [backend/utils/diseases/index.js](backend/utils/diseases/index.js) — everything else picks it up automatically.
4. Test it by sending matching symptoms straight to `POST /api/analyze` — the local engine runs on every request, so there's nothing else to configure.

---

### 6. Test Your Changes

The project does not yet have an automated test suite. Perform manual smoke tests:

- [ ] Full flow: symptom → analysis → GPS → facility result
- [ ] Auth flow: signup → logout → login → forgot password → reset password (check terminal for dev reset link)
- [ ] History: view list → view detail → delete
- [ ] PDF download
- [ ] Mobile viewport in Chrome DevTools (device toolbar, 390 px width)

> 💡 **TIP:** Because the engine is deterministic, the same symptom text always produces the same diagnosis — this makes it easy to write regression tests: pick a symptom string, note the expected top match, and assert on it.

---

### 7. Code Style Rules

- Use `const` and `let`, never `var`.
- PascalCase for React components; camelCase for functions and variables.
- Remove all `console.log` statements from backend route files before committing (these appear in production server logs).
- Never store raw passwords, tokens, or API keys in source code.
- Default to writing no comments. Only add one when the *why* is genuinely non-obvious.

---

### 8. Commit Your Changes

Stage only the files you changed (avoid `git add .`):

```bash
git add backend/utils/diseases/respiratory.js
```

Write a clear commit message:

```bash
git commit -m "feat: add COPD to respiratory disease database"
```

**Commit message format:**
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `refactor:` — restructuring with no behavior change
- `chore:` — dependency updates, config

---

### 9. Push and Open a Pull Request

```bash
git push origin feature/your-feature-name
```

Then on GitHub:
1. Go to your fork.
2. Click **"Compare & pull request"**.
3. Write a description: what changed, why, and how you tested it.
4. Reference related issues with `Fixes #123`.
5. Click **"Create pull request"**.

---

### 10. Keep Your Branch Up to Date

If `main` has been updated since you branched:

```bash
git fetch upstream
git rebase upstream/main
```

---

### All Project Scripts

| Location | Command | What It Does |
|---|---|---|
| Root | `npm run dev` | Starts backend + frontend concurrently |
| `backend/` | `npm run dev` | Starts backend only with auto-restart |
| `backend/` | `npx prisma studio` | Opens visual database browser at `http://localhost:5555` |
| `backend/` | `npx prisma migrate dev --name <name>` | Creates and applies a new migration |
| `backend/` | `npx prisma migrate deploy` | Applies all pending migrations (use in production) |
| `backend/` | `npx prisma generate` | Regenerates Prisma Client after schema changes |
| `frontend/` | `npm run dev` | Starts frontend dev server only |
| `frontend/` | `npm run build` | Builds optimised production bundle to `dist/` |
| `frontend/` | `npm run preview` | Serves the production build locally for testing |
| `frontend/` | `npx cap sync android` | Syncs web build into the Android Capacitor project |
| `frontend/` | `npx cap open android` | Opens Android Studio for APK compilation |

---

## ⚕️ Medical Disclaimer

MediFind is a rule-based informational tool only — it does not use AI or machine learning to generate diagnoses. It does **not** provide diagnoses, treatment plans, or prescriptions. Information is based on deterministic symptom matching against a curated disease knowledge base and may be incomplete or inaccurate.

Always consult a qualified healthcare professional. Never delay seeking medical advice based on this app.

**In an emergency call emergency services immediately:**
- 🇮🇳 India: **108**
- 🌍 International: **112**
- 🇺🇸 USA: **911**
- 🇬🇧 UK: **999**

MediFind and its developers accept no liability for actions taken based on information from this application.

---

## 📄 License

MIT — free to use, copy, modify, and distribute including in commercial projects. See `LICENSE` for full text.

---

*Built for accessible healthcare in India.*
