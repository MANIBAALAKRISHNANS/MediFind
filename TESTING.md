# 🧪 MediFind — Testing Checklist

Use this checklist when verifying a build before releasing. Test on both **web browser** and **Android device/emulator** where marked.

---

## 1 · Backend Health

- [ ] `GET /api/health` → `{ status: "ok", db: "connected" }`
- [ ] Backend starts without errors: `npm --prefix backend run dev`
- [ ] Prisma migration runs cleanly: `npx prisma migrate dev --name init`
- [ ] DB connection test passes on startup (check console: "✅ PostgreSQL connected")

---

## 2 · Authentication

### Sign Up
- [ ] Valid name + email + strong password → account created, JWT returned
- [ ] Duplicate email → `409 Email already registered.`
- [ ] Weak password (no number) → validation error shown
- [ ] Short name (< 2 chars) → validation error shown
- [ ] After signup → redirect to `/` (home)

### Log In
- [ ] Correct credentials → JWT stored in `localStorage`, redirect to `/`
- [ ] Wrong password → `401 Invalid credentials.` (no redirect)
- [ ] Non-existent email → same `401 Invalid credentials.` (no info leak)
- [ ] After login → `GET /api/auth/me` succeeds with user data

### Forgot Password
- [ ] Valid email → success screen shown (even if email not found)
- [ ] Dev mode: reset link logged to backend console
- [ ] Reset link format: `/reset-password?token=...&email=...`

### Reset Password
- [ ] Valid token + matching passwords → success → redirect to `/login`
- [ ] Expired or invalid token → error message shown
- [ ] Passwords don't match → match indicator shows red ✗
- [ ] Missing token/email param → "Invalid or missing reset link" message

### Route Guards
- [ ] Visiting `/login` while logged in → redirect to `/`
- [ ] Visiting `/` while logged out → redirect to `/login`
- [ ] JWT expiry / manual `localStorage` clear → redirect to `/login` on next request
- [ ] During auth bootstrap (`isInitialized: false`) → spinner shown on protected routes, nothing on public routes (no flash)

---

## 3 · Symptom Analysis

- [ ] Empty textarea → analyze button disabled
- [ ] Type symptoms manually → char counter updates
- [ ] Click a chip (e.g. "Fever") → appended to textarea; no duplicates
- [ ] Click **Analyze Symptoms** → `AnalyzingLoader` shown with rotating messages
- [ ] Result: `DiagnosisCard` rendered with disease, severity badge, urgency
- [ ] **Self-care urgency** → green banner "Self-care — manageable at home"
- [ ] **See-doctor urgency** → orange banner "See a Doctor"
- [ ] **Emergency urgency** → red `EmergencyBanner` with callable phone links
- [ ] Recommendations list rendered (at least 1 item)
- [ ] Red flags section visible when `redFlags` array is non-empty
- [ ] Analysis saved → `analysisId` returned from API and stored in state

---

## 4 · Facility Search

- [ ] Click **Find Best Doctor Near Me** → location permission prompt (browser or Android)
- [ ] Location granted → `LocationLoader` shown (pulsing rings)
- [ ] Result: `BestMatchCard` rendered with name, address, distance
- [ ] Score breakdown visible: distance / type / relevance / completeness
- [ ] **OSM Map** link opens correct OpenStreetMap URL
- [ ] **Directions** link opens OSM directions in new tab
- [ ] Phone number tappable (tel: link)
- [ ] No results in 5 km → auto-expands to 15 km (verify via console log or no-result state)
- [ ] **Download Report** button → PDF downloaded with analysisId in filename
- [ ] PDF contains: header, symptoms, diagnosis, facility section, disclaimer, page X of Y

### 📱 Android-specific
- [ ] `requestPermissions()` called before `getCurrentPosition`
- [ ] Permission denied → graceful error message (not crash)
- [ ] Location resolves via Capacitor Geolocation plugin (not browser API)

---

## 5 · History

- [ ] `/history` shows list of past analyses (paginated)
- [ ] Each card shows: disease, severity badge, formatted date-time
- [ ] Skeleton loader shown during fetch
- [ ] Empty state (no analyses yet) → EmptyState component with CTA
- [ ] **Pagination** — next/prev buttons, correct page count
- [ ] **Action menu** (⋯) → Delete option → ConfirmDialog appears
- [ ] Confirm delete → item removed from list, success toast
- [ ] Click history item → navigate to `/history/:id`

### Analysis Detail (`/history/:id`)
- [ ] Loads correct analysis from DB
- [ ] DiagnosisCard shown with `hideActions=true` (no find-doctor / reset buttons)
- [ ] If `matchName` exists → BestMatchCard reconstructed from flat DB fields
- [ ] **Download PDF** button works
- [ ] **Delete** button → ConfirmDialog → deletes and navigates back to `/history`

---

## 6 · Profile Page

- [ ] Avatar shows correct initials (1–2 letters from name)
- [ ] Name and email displayed
- [ ] "Member since" date formatted correctly (e.g. "January 2025")
- [ ] **Change Password** → navigates to `/forgot-password`
- [ ] **Medical Disclaimer** → expands/collapses with animation
- [ ] **Contact Support** → opens `mailto:medifind@gmail.com`
- [ ] **Report a Problem** → opens mailto with subject line
- [ ] **Sign Out** → clears token, toast "Signed out.", redirect to `/login`

---

## 7 · Side Drawer

- [ ] Hamburger icon (top-left on Home) → drawer slides in from left
- [ ] Backdrop click → drawer closes
- [ ] ESC key → drawer closes
- [ ] Body scroll locked while drawer is open
- [ ] Active route highlighted (medical-50 bg, medical-700 text, semibold)
- [ ] User avatar + name + email shown in drawer header
- [ ] Navigate via drawer → closes and updates route
- [ ] **Sign Out** in drawer → same behavior as Profile sign out

---

## 8 · UI / Design System

- [ ] iOS-style card shadows rendered (no hard borders)
- [ ] Fonts load (Inter + Sora display)
- [ ] Custom Tailwind colors applied (medical-*, ios-*)
- [ ] Animations play (slide-up, fade-in, spring transitions)
- [ ] `TopBar` glass effect visible (backdrop-blur)
- [ ] `Badge` variants: mild (green), moderate (amber), severe (red)
- [ ] `Button` loading state: spinner + disabled while API call in flight
- [ ] `Input` error state: red ring on validation failure
- [ ] `ConfirmDialog` uses red "danger" button style
- [ ] `EmptyState` rendered correctly with icon + text

---

## 9 · Error Handling

- [ ] Backend down → "Unable to connect. Check your internet and try again."
- [ ] 500 from API → "Something went wrong. Please try again. If the problem persists, contact medifind@gmail.com"
- [ ] 401 (expired token, non-auth route) → redirect to `/login`
- [ ] Gemini returns malformed JSON → backend returns 502 with error message
- [ ] No facilities found in 15 km → UI shows appropriate empty state
- [ ] Location timeout → error message, user can retry

---

## 10 · Rate Limiting

- [ ] Sending > 30 requests/min to `/api/` from same IP → `429 Too Many Requests`
- [ ] Legitimate requests after cooldown succeed normally

---

## 11 · PDF Report

- [ ] Header: "MEDIFIND" in teal, "Medical Analysis Report" subtitle
- [ ] Metadata: patient name, email, date, analysis ID (first 8 chars)
- [ ] Symptoms section: gray background box
- [ ] Diagnosis: disease, specialty, severity, urgency, description
- [ ] Recommendations list
- [ ] Red flags (if present)
- [ ] Facility section (if matched) — name, address, phone, website, distance
- [ ] Medical disclaimer text at bottom
- [ ] Footer: "Page X of Y" on every page
- [ ] Filename format: `medifind-report-[8-char-id].pdf`

---

## 12 · Android APK

- [ ] `npm run android:build` completes without Gradle errors
- [ ] APK installs on Android 8+ (API 26+)
- [ ] App launches — MediFind splash/loading screen
- [ ] Login / signup flow works on device
- [ ] StatusBar style correct (light text on teal or white background)
- [ ] Location permission dialog appears on first use
- [ ] Facility search works (Overpass reachable from device network)
- [ ] PDF download works on device (opens with default PDF viewer)

---

## ✅ Pre-Release Checklist

- [ ] `backend/.env` — all keys filled in (DATABASE_URL, JWT_SECRET, CORS_ORIGIN)
- [ ] `frontend-web/.env.production` — `VITE_API_URL` points to deployed backend
- [ ] `.gitignore` excludes both `.env` files
- [ ] `npm run build` (frontend) completes without TypeScript / lint errors
- [ ] `npx prisma migrate deploy` run against production DB
- [ ] CORS `origin` in `server.js` updated to production frontend domain
- [ ] Rate limit reviewed (30/min may be too tight for prod — consider increasing)
- [ ] `nodemailer` configured with real SMTP credentials for password reset emails
