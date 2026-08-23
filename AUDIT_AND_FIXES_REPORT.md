# MediFind — Full Project Details, Audit & Fix Report

> Generated from the complete code review session on 2026-06-01.
> All bugs found in this session, their root causes, and every fix applied are documented here.

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project File Structure](#3-project-file-structure)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Features & Screens](#5-features--screens)
6. [Backend API Reference](#6-backend-api-reference)
7. [Database Schema](#7-database-schema)
8. [Environment Variables](#8-environment-variables)
9. [How to Run (Web + Android)](#9-how-to-run-web--android)
10. [Full Bug Audit — All Errors Found & Fixed](#10-full-bug-audit--all-errors-found--fixed)
11. [Build Status](#11-build-status)
12. [Remaining Manual Actions Before Deployment](#12-remaining-manual-actions-before-deployment)

---

## 1. PROJECT OVERVIEW

**MediFind** is a mobile-first, full-stack health-tech application that:
1. Accepts free-text symptom descriptions from the user.
2. Analyses them using Google Gemini AI (with a 3-model cascade and a 45-disease offline fallback engine).
3. Returns a structured diagnosis: disease name, confidence, specialty to visit, severity (mild/moderate/severe), urgency, recommendations, red flags, differential diagnoses, and home-care tips.
4. Locates the nearest appropriate medical facility via the OpenStreetMap Overpass API and ranks results with a multi-factor scoring algorithm.
5. Saves every analysis to both `localStorage` (offline-resilient) and a PostgreSQL database (cross-device).
6. Allows downloading a full PDF report of any analysis.

Target platforms: **Web browser** and **Android** (via Capacitor hybrid app).

---

## 2. TECHNOLOGY STACK

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend UI | React | 18.3.1 | Component-based SPA |
| Build tool | Vite | 5.4.3 | Dev server + production bundler |
| Styling | Tailwind CSS | 3.4.11 | Utility-class iOS-style design system |
| Animation | Framer Motion | 11.18.2 | Card transitions, loaders, micro-interactions |
| State management | Zustand | 5.0.13 | Auth store, minimal boilerplate |
| Routing | React Router | 7.15.1 | Nested protected/public routes |
| HTTP client | Axios | 1.7.7 | API calls with interceptors + token injection |
| Date formatting | date-fns | 4.3.0 | History timestamps |
| Toast notifications | react-hot-toast | 2.6.0 | Success/error feedback |
| Icons | lucide-react | 0.441.0 | Icon set |
| Mobile wrapper | Capacitor | 6.1.2 | Android native app from React web code |
| Native GPS | @capacitor/geolocation | 6.0.2 | High-accuracy GPS on Android |
| PDF (client) | HTML print + Blob | — | Browser-based PDF report generation |
| Backend runtime | Node.js | ≥18.0.0 | Server |
| Backend framework | Express | 4.21.0 | REST API |
| ORM | Prisma | 5.22.0 | Type-safe PostgreSQL queries |
| Database | PostgreSQL (local dev) | — | Persistent storage |
| Auth | JWT + bcryptjs | — | Token-based authentication |
| Cookies | cookie-parser | 1.4.7 | HttpOnly session cookies (web) |
| Email | Nodemailer | 8.0.9 | Password reset emails |
| Validation | Joi | 17.13.3 | Request body validation |
| Security headers | Helmet | 8.0.0 | XSS, HSTS, clickjacking protection |
| Rate limiting | express-rate-limit | 7.4.1 | 100 req/min per IP on all /api/ routes |
| Cache | ioredis + in-memory Map | 5.11.0 | 3-min TTL cache for diagnosis results |
| PDF (server) | PDFKit | 0.15.0 | Server-side PDF generation for /history/:id/pdf |
| AI | Google Gemini API | 2.0-flash | Symptom analysis (free tier) |
| Maps | OpenStreetMap Overpass | — | Nearby hospital/clinic lookup (no API key) |
| Android build | Gradle + AGP | 9.4.1 / 9.2.1 | Android APK builder |
| Android JDK | Eclipse Adoptium | JDK 21 | Java compile toolchain |
| Android SDK | Android SDK | API 34 | Target Android SDK |

---

## 3. PROJECT FILE STRUCTURE

```
medifind/                          ← monorepo root
├── package.json                   ← root scripts (dev, build, android:dev, android:build)
├── backend/
│   ├── server.js                  ← Express app, middleware, route mounting, server start
│   ├── db.js                      ← Prisma singleton client
│   ├── .env                       ← local secrets (not committed)
│   ├── .env.example               ← template showing required env vars
│   ├── prisma/
│   │   ├── schema.prisma          ← User + Analysis models
│   │   └── migrations/            ← SQL migration history
│   ├── routes/
│   │   ├── auth.js                ← signup, login, logout, forgot/reset password, profile
│   │   ├── analyze.js             ← Gemini cascade + local fallback + India patterns
│   │   ├── findDoctor.js          ← Overpass query + multi-factor ranking + DB persist
│   │   ├── history.js             ← CRUD for analysis history + PDF stream
│   │   └── health.js              ← GET /api/health liveness probe
│   ├── middleware/
│   │   ├── auth.js                ← requireAuth (cookie + Bearer header dual-mode)
│   │   └── validate.js            ← Joi schema validation middleware factory
│   └── utils/
│       ├── cache.js               ← Redis / in-memory LRU cache layer
│       ├── geminiQueue.js         ← 12 RPM token-bucket queue for Gemini
│       ├── ranking.js             ← Haversine distance + multi-factor facility scorer
│       ├── indianDiseasePatterns.js ← 96 India-prevalent disease pattern overrides
│       ├── localDiagnosis.js      ← 45-disease keyword fallback engine
│       ├── pdfReport.js           ← PDFKit report builder
│       ├── password.js            ← bcrypt hash/compare
│       ├── token.js               ← JWT sign
│       ├── userSafe.js            ← strip password/resetToken before API response
│       └── diseases/              ← disease category files for local engine
│
└── frontend/
    ├── index.html                 ← Vite HTML entry
    ├── vite.config.js             ← Vite config + /api proxy for dev
    ├── capacitor.config.json      ← Capacitor app config (appId, webDir, plugins)
    ├── tailwind.config.js         ← custom colours, fonts, radius tokens
    ├── .env                       ← VITE_API_URL= (empty for web dev — uses Vite proxy)
    ├── .env.production            ← VITE_API_URL for Android builds
    ├── scripts/
    │   └── fix-android.cjs        ← post-sync patcher (proguard + network_security_config.xml)
    ├── android/                   ← Capacitor-generated Android project
    │   ├── app/build.gradle       ← Android app module config
    │   ├── build.gradle           ← top-level Gradle (AGP 9.2.1)
    │   ├── variables.gradle       ← SDK versions (compileSdk=34, minSdk=22)
    │   ├── gradle.properties      ← JVM args, JDK path, AGP flags
    │   ├── settings.gradle        ← Capacitor plugin project includes
    │   └── app/src/main/
    │       ├── AndroidManifest.xml
    │       └── res/xml/network_security_config.xml ← HTTP allowlist for dev
    └── src/
        ├── main.jsx               ← React root, ErrorBoundary, BrowserRouter, Toaster
        ├── App.jsx                ← Route tree (PublicRoute / ProtectedRoute wrappers)
        ├── constants.js           ← TOKEN_KEY = 'medifind_token'
        ├── api/
        │   └── client.js          ← Axios instance with Bearer interceptor + getToken/setToken/clearToken
        ├── store/
        │   └── authStore.js       ← Zustand: user, token, login/signup/logout/loadUser
        ├── services/
        │   ├── apiService.js      ← analyzeSymptoms(), findBestDoctor(), geocodeCity()
        │   ├── authService.js     ← login/signup/logout/forgotPassword/resetPassword/getCurrentUser/updateProfile
        │   ├── locationService.js ← GPS → Capacitor native → IP fallback → city geocoder
        │   ├── historyService.js  ← localStorage analysis CRUD
        │   ├── generateReport.js  ← Client-side HTML-print PDF builder
        │   ├── claudeService.js   ← [DEAD CODE — not imported anywhere]
        │   ├── placesService.js   ← [DEAD CODE — calls /api/places which doesn't exist]
        │   ├── rankingService.js  ← [DEAD CODE — superseded by backend ranking.js]
        │   └── api.js             ← [DEAD CODE — legacy bare axios, only used by dead files]
        ├── pages/
        │   ├── HomePage.jsx       ← Dashboard + symptom flow state machine (8 stages)
        │   ├── HistoryPage.jsx    ← Paginated analysis history list
        │   ├── AnalysisDetailPage.jsx ← Full detail view for one analysis
        │   ├── ProfilePage.jsx    ← User profile, settings, logout
        │   ├── EditProfilePage.jsx ← Edit name/email form
        │   └── auth/
        │       ├── LoginPage.jsx
        │       ├── SignupPage.jsx
        │       ├── ForgotPasswordPage.jsx
        │       └── ResetPasswordPage.jsx
        ├── components/
        │   ├── ProtectedRoute.jsx ← Redirects to /login if not authenticated
        │   ├── PublicRoute.jsx    ← Redirects to / if already authenticated
        │   ├── SideDrawer.jsx     ← Hamburger menu with nav + logout
        │   ├── SymptomInput.jsx   ← Textarea + symptom chip shortcuts
        │   ├── DiagnosisCard.jsx  ← AI result card (disease, severity, recommendations, red flags)
        │   ├── BestMatchCard.jsx  ← Facility card (name, distance, score breakdown, actions)
        │   ├── AnalyzingLoader.jsx
        │   ├── LocationLoader.jsx
        │   ├── EmergencyBanner.jsx ← Red banner + emergency call buttons
        │   ├── EmergencyCard.jsx
        │   ├── ErrorCard.jsx
        │   ├── MedicalDisclaimerBanner.jsx
        │   ├── MedicalDisclaimerFull.jsx
        │   ├── AuthLayout.jsx
        │   └── ui/
        │       ├── Button.jsx, Input.jsx, PasswordInput.jsx
        │       ├── Badge.jsx, Spinner.jsx, Card.jsx
        │       ├── TopBar.jsx, BottomSheet.jsx
        │       ├── ConfirmDialog.jsx, EmptyState.jsx
        │       └── (Header.jsx — unused standalone component)
        └── utils/
            └── generateReport.js  ← HTML blob → window.open() → browser print dialog
```

---

## 4. ARCHITECTURE & DATA FLOW

### System Layers

```
[User Browser / Android App]
         │
         │  HTTPS / HTTP (Axios, JWT Bearer header)
         ▼
[Express Backend — port 5000]
   helmet → cors → rate-limit → cookieParser → json
         │
    ┌────┴─────────────────────────┐
    │  Routes                      │
    │  /api/auth      (auth.js)    │
    │  /api/analyze   (analyze.js) │
    │  /api/find-doctor            │
    │  /api/history   (history.js) │
    │  /api/health                 │
    └────┬─────────────────────────┘
         │
    ┌────┴──────────────┐    ┌──────────────────────┐
    │  PostgreSQL (Prisma)│    │  Redis / In-Memory LRU│
    │  Users + Analyses  │    │  3-min diagnosis cache│
    └───────────────────┘    └──────────────────────┘
         │
    ┌────┴──────────────────────────────┐
    │  External APIs                     │
    │  - Google Gemini (AI diagnosis)    │
    │  - OSM Overpass (hospital lookup)  │
    │  - Nominatim (city geocoding)      │
    │  - ipapi.co (IP location fallback) │
    └───────────────────────────────────┘
```

### Symptom Analysis Flow (Step by Step)

1. User types symptoms → clicks "Analyze Symptoms"
2. Frontend `POST /api/analyze` → backend receives request
3. Backend checks Redis / in-memory cache for same symptom key
4. **Cache hit** → return cached result immediately (saves Gemini API call)
5. **Cache miss** → acquire Gemini token from 12 RPM token-bucket queue
6. Try Gemini models in cascade order:
   - `gemini-2.0-flash` (attempt 1, attempt 2 if 5xx)
   - `gemini-2.0-flash-lite` (on 429 from previous)
   - `gemini-2.5-flash-lite-preview-06-17`
7. If all Gemini models fail → run `localDiagnose()` (45-disease keyword engine)
8. Apply India pattern cross-check → may override specialty / bump severity
9. Strip any medicine names from recommendations
10. Save to PostgreSQL + cache the result
11. Return `{ disease, specialty, severity, urgency, description, recommendations, redFlags, homeCare, whenToSeekHelp, differentialDiagnosis, confidence, analysisId }`
12. Frontend saves to `localStorage` immediately (offline resilient)
13. User taps "Find Best Doctor Near Me"
14. Frontend acquires GPS → Capacitor native GPS → IP fallback → city search
15. Frontend `POST /api/find-doctor { lat, lng, specialty, analysisId }`
16. Backend queries Overpass API (5km radius, expands to 15km if empty)
17. Score each facility (distance 40% + specialty 35% + type 15% + completeness 10%)
18. Save best match fields (`matchName`, `matchAddress`, `matchDirectionsUrl`, etc.) to DB
19. Return best match → frontend renders `BestMatchCard`

### Auth Flow

```
Signup/Login
  → backend issues 7-day JWT
  → sets HttpOnly cookie mf_token (web)
  → returns token in JSON body (Capacitor reads this, stores in localStorage)
  
Every API request:
  Web:     axios sends cookie automatically
  Android: axios interceptor attaches Authorization: Bearer <token>
  
Server:   requireAuth checks cookie first, then Bearer header
```

---

## 5. FEATURES & SCREENS

| Screen | Route | Description |
|---|---|---|
| Login | `/login` | Email + password, forgot password link |
| Signup | `/signup` | Name + email + password (strength meter) + disclaimer checkbox |
| Forgot Password | `/forgot-password` | Email → reset link sent to inbox |
| Reset Password | `/reset-password` | Token + new password (also served as HTML page by backend for email links) |
| Home / Dashboard | `/` | Greeting, stats, recent analyses, Analyze Symptoms CTA |
| Symptom Input | `/` (input stage) | Textarea + preset symptom chips, min 10 chars |
| Analyzing | `/` (analyzing stage) | Animated loader while Gemini processes |
| Diagnosis | `/` (diagnosis stage) | Disease card with severity, recommendations, red flags, actions |
| Location | `/` (locating stage) | GPS acquisition with fallback options |
| Doctor Result | `/` (result stage) | Best match facility card with score breakdown, call/directions/map/download |
| History | `/history` | List of all analyses (from DB if logged in, localStorage fallback) |
| Analysis Detail | `/history/:id` | Full detail — symptoms, diagnosis, facility, delete, PDF download |
| Profile | `/profile` | Avatar, account info, change password, disclaimer, version, support |
| Edit Profile | `/profile/edit` | Update name and email |
| Side Drawer | (overlay) | Navigation: Home, History, Profile + logout |

---

## 6. BACKEND API REFERENCE

All routes are prefixed `/api/`. Protected routes require `Authorization: Bearer <token>` header (Android) or `mf_token` cookie (web).

| Method | Route | Auth | Body / Params | Response |
|---|---|---|---|---|
| GET | `/health` | No | — | `{ status, timestamp }` |
| POST | `/auth/signup` | No | `{ name, email, password }` | `{ user, token }` |
| POST | `/auth/login` | No | `{ email, password }` | `{ user, token }` |
| POST | `/auth/forgot-password` | No | `{ email }` | `{ message }` |
| POST | `/auth/reset-password` | No | `{ email, token, newPassword }` | `{ message }` |
| GET | `/auth/me` | Yes | — | `safeUser` |
| PUT | `/auth/profile` | Yes | `{ name, email }` | `safeUser` |
| POST | `/auth/logout` | Yes | — | `{ message }` |
| POST | `/analyze` | Yes | `{ symptoms, age?, gender? }` | diagnosis + `analysisId` |
| POST | `/find-doctor` | Yes | `{ lat, lng, specialty, analysisId? }` | `{ bestMatch, alternativesCount, source }` |
| GET | `/history` | Yes | Query: `limit?, cursor?` | `{ analyses[], nextCursor, hasMore, total? }` |
| GET | `/history/:id` | Yes | — | Full `Analysis` record |
| DELETE | `/history/:id` | Yes | — | `{ message }` |
| GET | `/history/:id/pdf` | Yes | — | Binary PDF stream |
| GET | `/reset-password` | No | Query: `token, email` | HTML page (for email links on mobile) |

---

## 7. DATABASE SCHEMA

```prisma
model User {
  id                String     @id @default(uuid())
  name              String
  email             String     @unique
  password          String     // bcrypt hash
  resetToken        String?    // hex token for password reset
  resetTokenExpires DateTime?
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  analyses          Analysis[]

  @@index([email])
}

model Analysis {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  symptoms        String

  // AI Diagnosis
  disease         String?
  specialty       String?
  severity        String?   // mild | moderate | severe
  urgency         String?   // self-care | see-doctor-soon | see-doctor-today | emergency
  description     String?
  recommendations String[]  @default([])
  redFlags        String[]  @default([])

  // Best Match Facility (set after doctor search)
  matchName           String?
  matchAddress        String?
  matchPhone          String?
  matchWebsite        String?
  matchType           String?
  matchDistanceKm     Float?
  matchLat            Float?
  matchLng            Float?
  matchOsmMapUrl      String?
  matchDirectionsUrl  String?   // ← added in migration 20260601121803
  matchScore          Int?

  // User's location at time of search
  locationLat     Float?
  locationLng     Float?

  createdAt       DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
}
```

Applied migrations:
- `20260601121803_add_match_directions_url` — adds `matchDirectionsUrl` field

---

## 8. ENVIRONMENT VARIABLES

### `backend/.env`

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | `AIzaSy...` | Google Gemini AI key |
| `JWT_SECRET` | Yes (≥32 chars) | 64-char hex string | JWT signing secret |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host/db` | PostgreSQL connection |
| `PORT` | No | `5000` | Backend port (default 5000) |
| `NODE_ENV` | No | `development` | Environment mode |
| `SUPPORT_EMAIL` | No | `medifindofficial@gmail.com` | Shown in emails and PDF footer |
| `SMTP_HOST` | Yes (for email) | `smtp.gmail.com` | Email relay host |
| `SMTP_PORT` | Yes (for email) | `587` | Email relay port |
| `SMTP_USER` | Yes (for email) | Gmail address | SMTP login |
| `SMTP_PASS` | Yes (for email) | App password | SMTP password |
| `FRONTEND_URL` | Yes | `http://192.168.1.6:5000` | Base URL for password-reset links in emails |
| `CORS_ORIGIN` | Production only | `https://medifind.yourdomain.com` | Restrict CORS in production |
| `REDIS_URL` | Optional | `redis://localhost:6379` | Redis cache URL (in-memory fallback if unset) |

### `frontend/.env`

| Variable | Value | Purpose |
|---|---|---|
| `VITE_API_URL` | `` (empty) | Web dev — uses Vite proxy so leave blank |

### `frontend/.env.production`

| Mode | VITE_API_URL value |
|---|---|
| Android Emulator (default active) | `http://10.0.2.2:5000` |
| Physical device (same Wi-Fi) | `http://192.168.1.6:5000` (uncomment, comment emulator line) |
| Production deployment | `https://api.medifind.yourdomain.com` |

---

## 9. HOW TO RUN (Web + Android)

### Prerequisites

- Node.js ≥18
- PostgreSQL running locally at `localhost:5432` with database `medifind`
- Android Studio installed (for Android)
- JDK 21 (Eclipse Adoptium) installed and configured in `gradle.properties`
- Android SDK API 34

### Web Browser

```bash
# From project root
npm install
npm --prefix backend install
npm --prefix frontend install

# Start both backend (port 5000) + frontend (port 5173) together
npm run dev
```

Open `http://localhost:5173` in your browser.
The Vite dev server proxies all `/api/*` calls to `http://localhost:5000` automatically.

### Android Emulator (in Android Studio)

```bash
# From project root — builds frontend, syncs into android/, opens Android Studio
npm run android:dev
```

Inside Android Studio:
1. Wait for Gradle sync to finish
2. Press **▶ Run** (Shift+F10)
3. Select an API 34 emulator → OK

The emulator reaches the backend via `http://10.0.2.2:5000` (10.0.2.2 always maps to the host machine's localhost inside the emulator).

### Physical Android Device (same Wi-Fi)

1. Check your machine's LAN IP: run `ipconfig` → look for `IPv4 Address`
2. Edit `frontend/.env.production` — uncomment the physical device line and comment the emulator line:
   ```
   # VITE_API_URL=http://10.0.2.2:5000
   VITE_API_URL=http://192.168.1.6:5000   ← use your actual LAN IP
   ```
3. Rebuild and sync:
   ```bash
   npm run build                          # from root
   npm --prefix frontend run android:sync # re-syncs + patches network_security_config.xml
   ```
4. Connect phone via USB (enable USB debugging on the phone)
5. In Android Studio → ▶ Run → select your device

> **Note:** `scripts/fix-android.cjs` now auto-detects your LAN IP using `os.networkInterfaces()` and rewrites `network_security_config.xml` every sync. You do not need to manually update the IP anymore.

---

## 10. FULL BUG AUDIT — ALL ERRORS FOUND & FIXED

This section covers every bug found during the audit session, grouped by session phase.

---

### PHASE 1 — Initial Cross-Platform Audit

---

#### BUG #1 — Hardcoded token key in `AnalysisDetailPage.jsx`

**File:** `frontend/src/pages/AnalysisDetailPage.jsx` (lines 53, 74)

**Problem:**
```js
// BEFORE (wrong)
const token = localStorage.getItem('medifind_token')
```
The string `'medifind_token'` was hardcoded in two places. The project has a `TOKEN_KEY` constant in `constants.js` for exactly this purpose. If the key name ever changes, these two raw strings would silently break (user appears logged out even though they have a valid token).

**Fix:**
```js
// AFTER (correct)
import client, { getToken } from '../api/client.js'
// ...
if (getToken()) {
  const res = await client.get(`/api/history/${id}`)
```
Imported `getToken()` from `client.js` which reads the in-memory cached token (already reads `TOKEN_KEY` internally), and replaced both raw `localStorage.getItem` calls.

---

#### BUG #2 — Hardcoded token key in `SymptomInput.jsx`

**File:** `frontend/src/components/SymptomInput.jsx` (line 74)

**Problem:**
```js
// BEFORE (wrong)
hasToken: !!localStorage.getItem('medifind_token'),
```
Same hardcoded string in a debug log.

**Fix:**
```js
// AFTER (correct)
import { TOKEN_KEY } from '../constants.js'
// ...
hasToken: !!localStorage.getItem(TOKEN_KEY),
```

---

#### BUG #3 — 8 deprecated Android Gradle properties

**File:** `frontend/android/gradle.properties`

**Problem:**
8 AGP properties deprecated in AGP 9.x printed warnings on every build and will become hard errors in AGP 10.0:
```
android.defaults.buildfeatures.resvalues=true
android.sdk.defaultTargetSdkToCompileSdkIfUnset=false
android.enableAppCompileTimeRClass=false
android.usesSdkInManifest.disallowed=false
android.r8.optimizedResourceShrinking=false
android.builtInKotlin=false
android.newDsl=false
```
Also 16 repeated `android.dependency.excludeLibraryComponentsFromConstraints` advisory messages cluttered build output.

**Fix:**
Removed all 7 deprecated property lines. Added `android.generateSyncIssueWhenLibraryConstraintsAreEnabled=false` to suppress the repeated constraint advisories. Retained only non-deprecated properties.

---

### PHASE 2 — Pre-Deployment Readiness Check

---

#### BUG #4 — Edit Profile icons completely invisible

**File:** `frontend/src/pages/EditProfilePage.jsx` (lines 93, 110)

**Problem:**
```jsx
// BEFORE (wrong prop name)
<Input leftIcon={<User size={16} className="text-ios-gray" />} ... />
<Input leftIcon={<Mail size={16} className="text-ios-gray" />} ... />
```
The `Input` component only accepts an `icon` prop (not `leftIcon`). Passing `leftIcon` caused it to fall through into `...rest` and get spread onto the underlying `<input>` DOM element — which ignores unknown props. Result: **both the name icon and email icon were completely invisible** in the Edit Profile form, even though they appeared to be configured correctly.

**Fix:**
```jsx
// AFTER (correct prop name)
<Input icon={<User size={16} className="text-ios-gray" />} ... />
<Input icon={<Mail size={16} className="text-ios-gray" />} ... />
```

---

#### BUG #5 — "Change Password" button completely broken for logged-in users

**File:** `frontend/src/pages/ProfilePage.jsx` (line 137)

**Problem:**
```jsx
// BEFORE (broken)
<ListRow
  label="Change Password"
  onPress={() => navigate('/forgot-password')}
/>
```
`/forgot-password` is wrapped inside `<PublicRoute>`, which contains this logic:
```jsx
if (user) return <Navigate to="/" replace />
```
So any logged-in user who tapped "Change Password" was immediately redirected back to the home screen. The button appeared to do nothing.

**Fix:**
Instead of navigating to the forgot-password page, the fix calls `authService.forgotPassword(user.email)` directly from the Profile page — sending the reset email without leaving the screen:
```jsx
// AFTER (correct)
async function handleChangePassword() {
  setSendingReset(true)
  try {
    await authService.forgotPassword(user.email)
    toast.success('Password reset link sent to your email!')
  } catch {
    toast.error('Could not send reset email. Try again.')
  } finally {
    setSendingReset(false)
  }
}

<ListRow
  label={sendingReset ? 'Sending reset link…' : 'Change Password'}
  disabled={sendingReset}
  onPress={handleChangePassword}
/>
```

---

#### BUG #6 — Score breakdown "Why this match?" shows wrong max values

**File:** `frontend/src/components/BestMatchCard.jsx` (lines 165–168)

**Problem:**
The "Why this match?" breakdown panel displays each scoring category with a `max` value and a proportional bar. The max values in the frontend did not match the actual max values in `backend/utils/ranking.js`:

| Category | Frontend max (wrong) | Backend actual max |
|---|---|---|
| Specialty Match | 40 | **35** |
| Distance | 30 | **40** |
| Facility Type | 20 | **15** |
| Completeness | 10 | 10 ✓ |

This caused "Distance: 38 / 30" type labels (score exceeding the stated max) and incorrect proportional bars.

**Fix:**
```jsx
// BEFORE (wrong)
<ScoreRow label="Specialty Match" value={specialtyScore} max={40} ... />
<ScoreRow label="Distance"       value={distanceScore}  max={30} ... />
<ScoreRow label="Facility Type"  value={typeScore}      max={20} ... />

// AFTER (correct — matches backend ranking.js)
<ScoreRow label="Specialty Match" value={specialtyScore} max={35} ... />
<ScoreRow label="Distance"       value={distanceScore}  max={40} ... />
<ScoreRow label="Facility Type"  value={typeScore}      max={15} ... />
```

---

#### BUG #7 — "🧭 Directions" button disappears on history detail page

**Files:**
- `backend/prisma/schema.prisma`
- `backend/routes/findDoctor.js`

**Problem:**
When the user finds a doctor, `backend/utils/ranking.js` computes a `directionsUrl` (an OpenStreetMap directions link). However:
1. `directionsUrl` was **not saved to the database** — it was missing from the `prisma.analysis.updateMany` call in `findDoctor.js`.
2. The field `matchDirectionsUrl` did not exist in the Prisma schema at all.

Result: In the immediate session after finding a doctor, the Directions button worked (loaded from `localStorage`). But when the user opened the same analysis from History later (loaded from the DB), `matchDirectionsUrl` was `null` and the Directions button never appeared.

**Fix 1 — Schema:**
```prisma
// BEFORE
matchOsmMapUrl  String?
matchScore      Int?

// AFTER
matchOsmMapUrl      String?
matchDirectionsUrl  String?   ← new field
matchScore          Int?
```

**Fix 2 — Route:**
```js
// BEFORE — directionsUrl was NOT saved
await prisma.analysis.updateMany({
  data: {
    matchOsmMapUrl:  bestMatch.osmMapUrl,
    matchScore:      bestMatch.matchScore,
    ...
  }
})

// AFTER — directionsUrl IS saved
await prisma.analysis.updateMany({
  data: {
    matchOsmMapUrl:     bestMatch.osmMapUrl,
    matchDirectionsUrl: bestMatch.directionsUrl,  ← added
    matchScore:         bestMatch.matchScore,
    ...
  }
})
```

**Migration generated and applied:**
```
migrations/20260601121803_add_match_directions_url/migration.sql
ALTER TABLE "Analysis" ADD COLUMN "matchDirectionsUrl" TEXT;
```

---

#### BUG #8 — Real database credentials committed in `.env.example`

**File:** `backend/.env.example`

**Problem:**
The `.env.example` file (which IS committed to git and is meant to be a template) contained a real working NeonDB connection string including the username and password:
```
DATABASE_URL="postgresql://neondb_owner:npg_PNSq8v4InXod@ep-silent-union-apghu83z.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
```
Anyone with access to the git repository could use this to connect to the production database.

**Note:** The user reviewed this and confirmed they want to keep the real URL in the example file for their reference. The URL was restored after initially being replaced. The user should be aware of the security implications if this repository is shared or made public.

---

### PHASE 3 — Android Emulator "Unable to connect" Error

**Error shown:** Toast message — *"Unable to connect to the server. Please check your internet connection and try again."*

This appeared every time any API call was made from the Android emulator (login, signup, analyze, etc.).

---

#### BUG #9 — CORS mis-configuration blocks all Android API calls (ROOT CAUSE)

**File:** `backend/server.js` (line 61)

**Problem:**
```js
// BEFORE (broken)
const corsOrigin = process.env.CORS_ORIGIN || '*'
const corsOptions = {
  origin:      corsOrigin,   // '*'
  credentials: true,         // withCredentials: true on axios
}
```
The CORS specification and all modern browsers/WebViews (including Android's Chromium WebView used by Capacitor) have a strict rule:

> **`Access-Control-Allow-Origin: *` is INCOMPATIBLE with `Access-Control-Allow-Credentials: true`.**

When both appear in the response headers, the browser silently drops the response and Axios throws a network error — which the frontend normalizes to "Unable to connect to the server." This is why every single API call failed from Android (while web dev worked fine, because the Vite dev server proxies requests server-to-server, bypassing CORS entirely).

**Fix:**
```js
// AFTER (correct)
const corsOriginEnv = process.env.CORS_ORIGIN
const corsOrigin = corsOriginEnv || true  // true = reflect-origin mode

const corsOptions = {
  origin:      corsOrigin,   // reflects the request's Origin header back
  credentials: true,
}
```
Setting `origin: true` tells the `cors` package to echo back `Access-Control-Allow-Origin: <request-origin>` (whatever the actual origin was), which is permitted with `credentials: true`. This works correctly for any origin (emulator at `http://localhost`, physical device, web browser at `http://localhost:5173`, etc.) without being a security risk in development.

---

#### BUG #10 — `network_security_config.xml` had stale LAN IP

**File:** `frontend/android/app/src/main/res/xml/network_security_config.xml`

**Problem:**
The file contained the old machine LAN IP `192.168.1.8`:
```xml
<domain includeSubdomains="false">192.168.1.8</domain>
```
The machine's current IP is `192.168.1.6`. Physical device connections would fail because cleartext HTTP was not permitted to the new IP.

**Fix:**
Updated to `192.168.1.6`.

---

#### BUG #11 — `fix-android.cjs` script never updated a stale LAN IP

**File:** `frontend/scripts/fix-android.cjs`

**Problem:**
The post-sync script that patches `network_security_config.xml` only ran when `10.0.2.2` was absent from the file:
```js
// BEFORE — only patches if 10.0.2.2 is missing
if (!current.includes('10.0.2.2')) {
  fs.writeFileSync(NETWORK_CFG, NETWORK_XML, 'utf8')
}
```
Since `10.0.2.2` was already in the file, the script never ran again even when the LAN IP changed from `192.168.1.8` to `192.168.1.6`. The stale IP would persist indefinitely.

Also, the LAN IP (`192.168.1.8`) was hardcoded in the script itself, so it could never adapt to a new IP automatically.

**Fix:**
Rewrote the script to:
1. **Auto-detect** the current LAN IP using Node.js `os.networkInterfaces()` — no manual hardcoding.
2. **Always rewrite** the XML when the current LAN IP is not already in the file.

```js
// AFTER — auto-detect + always update if IP changed
const os = require('os')

function getLanIp() {
  const nets = os.networkInterfaces()
  for (const iface of Object.values(nets)) {
    for (const addr of iface) {
      if (addr.family === 'IPv4' && !addr.internal && addr.address.startsWith('192.168.')) {
        return addr.address
      }
    }
  }
  return '192.168.1.6'  // fallback
}

const LAN_IP = getLanIp()

const needsWrite = !fs.existsSync(NETWORK_CFG) ||
  !fs.readFileSync(NETWORK_CFG, 'utf8').includes(LAN_IP)

if (needsWrite) {
  fs.writeFileSync(NETWORK_CFG, buildXml(LAN_IP), 'utf8')
  console.log(`[fix-android] network_security_config.xml written (LAN IP: ${LAN_IP})`)
}
```

From now on, running `npm run android:sync` (or `npm run android:fix`) will automatically detect and apply the correct LAN IP regardless of network changes.

---

#### BUG #12 — `backend/.env` had stale LAN IP in `FRONTEND_URL`

**File:** `backend/.env`

**Problem:**
```
FRONTEND_URL=http://192.168.1.8:5000   ← old IP
```
`FRONTEND_URL` is used as the base URL in password reset emails (`${FRONTEND_URL}/reset-password?token=...`). When a user on a physical device taps the reset link in their email, the URL would point to the old IP and fail to load.

**Fix:**
```
FRONTEND_URL=http://192.168.1.6:5000   ← current IP
```

---

### SUMMARY TABLE — All Bugs

| # | File | Category | Severity | Status |
|---|---|---|---|---|
| 1 | `AnalysisDetailPage.jsx` | Hardcoded constant | Low | ✅ Fixed |
| 2 | `SymptomInput.jsx` | Hardcoded constant | Low | ✅ Fixed |
| 3 | `android/gradle.properties` | Deprecated config | Low | ✅ Fixed |
| 4 | `EditProfilePage.jsx` | Wrong prop name — icons invisible | Medium | ✅ Fixed |
| 5 | `ProfilePage.jsx` | Button completely broken | High | ✅ Fixed |
| 6 | `BestMatchCard.jsx` | Wrong score max values | Medium | ✅ Fixed |
| 7 | `schema.prisma` + `findDoctor.js` | Missing DB field — feature silently broken | High | ✅ Fixed + Migrated |
| 8 | `backend/.env.example` | Real DB credentials in committed file | Security | ⚠️ User chose to keep |
| 9 | `backend/server.js` | CORS mis-config — ALL Android API calls fail | Critical | ✅ Fixed |
| 10 | `network_security_config.xml` | Stale LAN IP — physical device fails | Medium | ✅ Fixed |
| 11 | `scripts/fix-android.cjs` | Script blind to IP changes | Medium | ✅ Fixed |
| 12 | `backend/.env` | Stale LAN IP in FRONTEND_URL | Low | ✅ Fixed |

---

## 11. BUILD STATUS

After all fixes:

| Target | Command | Status | Output |
|---|---|---|---|
| Web (Vite production build) | `npm run build` | ✅ Pass | `dist/index-*.js` 491 kB, `dist/index-*.css` 34 kB |
| Android (Gradle assembleDebug) | `cd android && gradlew assembleDebug` | ✅ Pass | `app/build/outputs/apk/debug/app-debug.apk` |
| Prisma DB migration | `prisma migrate dev` | ✅ Applied | `20260601121803_add_match_directions_url` |
| Capacitor sync | `npm run android:sync` | ✅ Pass | Assets copied + network_security_config.xml patched |

---

## 12. REMAINING MANUAL ACTIONS BEFORE DEPLOYMENT

These items cannot be automated — they require your credentials or infrastructure decisions.

### Critical (app won't work in production without these)

| Action | Detail |
|---|---|
| **Update `frontend/.env.production`** | Change `VITE_API_URL=http://10.0.2.2:5000` to your deployed backend URL e.g. `https://api.medifind.yourdomain.com` before the deployment team runs `npm run build` |
| **Set all `backend/.env` production values** | `GEMINI_API_KEY`, `JWT_SECRET` (≥32 chars), `DATABASE_URL` (production DB), `SMTP_*`, `FRONTEND_URL` (your web/mobile URL), `CORS_ORIGIN` (your frontend URL) |
| **Run DB migration on production** | After deploying backend code, run: `cd backend && npx prisma migrate deploy` — this applies the `matchDirectionsUrl` migration to the production database |
| **Rotate NeonDB credentials** | The NeonDB password was visible in `.env.example` in git history. Log into NeonDB dashboard → reset the database password |

### Important (non-blocking day-1)

| Action | Detail |
|---|---|
| **Delete dead code files** | 4 files in `frontend/src/services/` are completely unused: `api.js`, `claudeService.js`, `placesService.js`, `rankingService.js`. Safe to delete — ask for confirmation first. |
| **History pagination** | History page fetches max 50 entries. Users with >50 analyses in DB won't see older records (no load-more UI exists). |
| **No tests** | Zero automated tests exist in the project. Core flows work but have no regression safety net. |

---

*End of Report — MediFind Audit Session 2026-06-01*
