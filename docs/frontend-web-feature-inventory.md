# frontend-web — Complete Feature Inventory

**Purpose:** Source-of-truth documentation of every page, field, action, and API call in `frontend-web`, for building a matching Android app. This is a standalone read of `frontend-web/` only — no comparison to `android-app/` was performed or implied.

**Scope read in full:** `src/App.jsx`, everything in `src/pages/` (incl. `pages/auth/`), everything in `src/components/` (incl. `components/ui/`), everything in `src/services/`, `src/store/authStore.js`, `src/api/client.js`, `src/constants.js`, `src/utils/generateReport.js`.

---

## 0. Route map (order as defined in `App.jsx`)

| # | Path | Component | Guard |
|---|------|-----------|-------|
| 1 | `/login` | `LoginPage` | `PublicRoute` (redirects to `/` if already logged in) |
| 2 | `/signup` | `SignupPage` | `PublicRoute` |
| 3 | `/forgot-password` | `ForgotPasswordPage` | `PublicRoute` |
| 4 | `/reset-password` | `ResetPasswordPage` | `PublicRoute` |
| 5 | `/` | `HomePage` | `ProtectedRoute` (redirects to `/login` if not logged in) |
| 6 | `/history` | `HistoryPage` | `ProtectedRoute` |
| 7 | `/history/:id` | `AnalysisDetailPage` | `ProtectedRoute` |
| 8 | `/profile` | `ProfilePage` | `ProtectedRoute` |
| 9 | `/profile/edit` | `EditProfilePage` | `ProtectedRoute` |
| 10 | `*` (anything else) | — | `<Navigate to="/" replace />` — no UI of its own |

### Auth bootstrap & guards

- On every app load, `App.jsx`'s mount effect calls `authStore.loadUser()`: reads the cached token from `localStorage['medifind_token']`; if present, calls **`GET /api/auth/me`** to fetch the current user and repopulate `user` + `token` state. If that call fails (expired/invalid token), auth is cleared entirely. `isInitialized` is set `true` regardless of outcome — this flag gates both route guards below.
- **`ProtectedRoute`**: while `!isInitialized`, shows a full-screen splash (MediFind wordmark + spinner). Once initialized: no `user` → redirect to `/login`; else render the matched child route.
- **`PublicRoute`**: while `!isInitialized`, renders nothing (avoids a redirect flash). Once initialized: `user` present → redirect to `/`; else render the child route.
- **Global 401 handling** (`api/client.js`): any authenticated request that returns HTTP 401 (except calls to `/api/auth/*` itself) clears the token and does a **hard browser redirect** (`window.location.href = '/login'`) — a full page reload, not a client-side route change. Android equivalent: programmatic in-app navigation to the login screen + clearing stored credentials (no "reload" concept needed).

### API client behavior (applies to every page below)

- Base URL: `VITE_API_URL` env override, else `http://localhost:5000` in dev, else `/api` in production (assumes a reverse proxy).
- `withCredentials: true` (cookies sent — used so the server can clear an HttpOnly cookie on logout), 30s timeout, Bearer token attached from an in-memory cache mirroring `localStorage['medifind_token']`.
- Errors are normalized into one of three shapes before reaching page code: **(a)** a server error response → `Error` with `.message` (from `data.error`), `.code` (from `data.code`, default `REQUEST_ERROR`), `.status`, `.data`; **(b)** no response / network failure / timeout → `.message = 'Unable to connect to the server...'`, `.code = 'NETWORK_ERROR'`; **(c)** anything else → generic message pointing to `medifindofficial@gmail.com`, `.code = 'UNKNOWN_ERROR'`. Several pages branch on `.status`/`.message` (e.g. ResetPasswordPage's "expired link" detection) — this normalization is effectively part of the app's business logic and should be replicated by the Android network layer.

---

## 1. LoginPage — `/login`

**Fields displayed:** none (blank form on every visit).

**Editable fields:**
| Field | Type | Validation |
|---|---|---|
| Email | text (`type="email"`, autoComplete `email`, Mail icon, placeholder `you@example.com`, auto-focused on mount) | On submit only: must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, else "Enter a valid email address." |
| Password | password (show/hide eye toggle, autoComplete `current-password`, placeholder `••••••••`) | On submit only: non-empty, else "Password is required." |

**Buttons / actions:**
- **Sign In** (primary, shows spinner while `authStore.isLoading`) → validates, then `authStore.login(email.trim().toLowerCase(), password)` → **`POST /api/auth/login`** `{email, password}` → `{user, token}`. Success: token saved to `localStorage['medifind_token']` + store state, `toast.success('Welcome back!')`, navigate to `/` (replace). Failure: `toast.error(err.message)`.
- **Enter key** in either field triggers the same submit.
- **"Forgot Password?"** link → `/forgot-password`.
- **"Create account"** link → `/signup`.

**Conditional UI:** field-level red error text under each input; button spinner while loading. No page-level error/empty states.

**Endpoint:** `POST /api/auth/login`.

**Web-only vs portable:** entirely standard form/CRUD; ports directly. `localStorage` token cache → Android `SharedPreferences`/`DataStore`/Keystore.

---

## 2. SignupPage — `/signup`

**Fields displayed:** none (blank form).

**Editable fields:**
| Field | Type | Validation |
|---|---|---|
| Full Name | text (autoComplete `name`, User icon, placeholder `Jane Smith`, auto-focused) | trimmed length ≥ 2, else "Name must be at least 2 characters." |
| Email | text (`type="email"`, Mail icon) | same email regex as Login, else "Enter a valid email address." |
| Password | password (show/hide toggle, autoComplete `new-password`, placeholder `Min. 8 characters`) | strength score ≥ 2 (see below), else "Password must be at least 8 chars with a letter and number." |
| "I agree to the Medical Disclaimer and Terms of Use" | custom checkbox | must be checked, else "You must agree to continue." **Note:** "Medical Disclaimer" and "Terms of Use" are plain styled `<span>`s with no `href`/`onClick` — not actually clickable/linked anywhere in the code. |

**Password strength meter** (live, appears only once the field is non-empty): score 0–4, +1 each for: length ≥ 8, contains a letter, contains a digit, contains a non-alphanumeric char. Renders as 3 segmented bars (gray→red/orange/green by score) plus a label (`Weak`/`Medium`/`Strong`) and static hint text "At least 8 chars, 1 letter, 1 number." This exact scoring function is reused verbatim on ResetPasswordPage.

**Buttons / actions:**
- **Create Account** (primary, spinner while loading) — **disabled** unless name≥2 chars AND email valid AND strength≥2 AND agreed. On submit: `authStore.signup(name.trim(), email.trim().toLowerCase(), password)` → **`POST /api/auth/signup`** `{name, email, password}` → `{user, token}`. Success: auth stored, `toast.success('Account created! Welcome to MediFind 🎉')`, navigate `/` (replace). Failure: `toast.error(err.message)`.
- **"Sign in"** link → `/login`.

**Endpoint:** `POST /api/auth/signup`.

**Web-only vs portable:** standard form; ports directly. The password-strength rule and the disabled/enabled submit-gating logic are business rules to copy exactly.

---

## 3. ForgotPasswordPage — `/forgot-password`

**Fields displayed:** none initially.

**Editable field:**
| Field | Type | Validation |
|---|---|---|
| Email Address | text (`type="email"`, Mail icon, auto-focused) | email regex on submit, else "Enter a valid email address."; error clears as soon as the user edits the field again. |

**Buttons / actions:**
- **Send Reset Link** (primary, spinner while loading) → `authStore.forgotPassword(email.trim().toLowerCase())` → **`POST /api/auth/forgot-password`** `{email}` → `{message}` (backend intentionally returns the same generic response whether or not the account exists — the client never learns which). Success → flips to the **sent state** below. Failure → inline error text under the field.
- **"← Back to Sign In"** link → `/login` (present in both states).
- **`medifindofficial@gmail.com`** mailto footer link (form state only).

**Conditional UI states:**
- **Form state** (default): input + submit button.
- **Sent state** (after success, animated cross-fade swap): green checkmark icon, "If an account exists for **{email}**", explanatory text noting the link "expires in 1 hour" and must be opened "on this device", back-to-sign-in link.

**Endpoint:** `POST /api/auth/forgot-password`.

**Web-only vs portable:** portable directly; the cross-fade transition is cosmetic (Framer Motion → any native transition).

---

## 4. ResetPasswordPage — `/reset-password`

**Entry mechanism:** this page only makes sense as a **deep link from an email** — it reads `email` and `token` from the URL query string (`useSearchParams`). **Android needs App Links / an intent-filter deep link to replicate the email-click entry point**, since there's no query-string URL concept in a native app.

**Guard state — missing/invalid params** (`!email || !token`): shows "Invalid link" — red warning icon, "This reset link is invalid or missing required parameters. Please request a new one.", **"Request New Link"** button → `/forgot-password`, **"Back to Sign In"** link → `/login`. No form is rendered in this state.

**Normal state (both params present):**

**Fields displayed:** the target email, read-only, decoded from the URL param — "Resetting password for **{email}**".

**Editable fields:**
| Field | Type | Validation |
|---|---|---|
| New Password | password (show/hide toggle, autoComplete `new-password`, auto-focused) | same strength≥2 rule as Signup, else "Password must be at least 8 chars with a letter and number." |
| Confirm Password | password (show/hide toggle) | must equal New Password, else "Passwords do not match." Live green/red **match indicator** ("✓ Passwords match" / "✗ Passwords don't match") appears the moment this field is non-empty and updates on every keystroke. |

**Buttons / actions:**
- **Reset Password** (primary, local `loading` state) — **disabled** unless strength≥2 AND both passwords match AND confirm is non-empty. On submit: `authStore.resetPassword(email, token, newPassword)` → **`POST /api/auth/reset-password`** `{email, token, newPassword}` → `{message}`. Success: `toast.success(...)`, navigate `/login` (replace). Failure: if `err.status === 400` or the message contains "expired"/"invalid" (case-insensitive) → `toast.error('Reset link expired. Please request a new one.')` and navigate to `/forgot-password`; otherwise a generic error toast.
- **"← Back to Sign In"** link → `/login`.

**Endpoint:** `POST /api/auth/reset-password`.

---

## 5. HomePage — `/`

The most complex screen: a single route driven by a `useReducer` state machine with **9 stages**. Each stage below is effectively a distinct view within the same route.

**Persistent chrome (all stages):** `TopBar` title "MediFind"; left = hamburger button opening the `SideDrawer` (see §11); right = history-icon button → navigate to `/history`.

### 5.1 Stage `dashboard` (default / landing stage, and the `RESET` target)

**Fields displayed:**
- Greeting: "{Good morning / Good afternoon / Good evening} 👋" based on local device hour (`<12`/`<17`/else).
- "Hi, {firstName}" — first word of `authStore.user.name`, or "there" if missing.
- Subtext "How are you feeling today?"
- **Stats row** (2 cards):
  - **Total Analyses** — count. Initial value = length of the local history cache (`localStorage['medifind_history']`, capped at 50). If logged in (`token` present), immediately overwritten by **`GET /api/history?limit=3`** → `res.data.total`. Silently keeps the local value if that request fails.
  - **Last Check** — date of the most recent analysis (`MMM d, yyyy` + `h:mm a` beneath), or "Never" if none exist.
- **Recent Analyses** list (only if ≥1 exists) — up to 3 rows, each: icon, disease name (truncated), formatted date/time, severity Badge, chevron. Row click → `/history/{id}`. Section header has a **"See All"** button → `/history`.
- **Empty state** (only if 0 analyses exist): icon + "No analyses yet" + hint to tap "Analyze Symptoms".
- Static footer disclaimer text.

**Buttons / actions:**
- Big **"Analyze Symptoms"** CTA card → clears any previous input error, moves to the `input` stage.

**Endpoint:** `GET /api/history?limit=3` (logged-in only; silently ignored on failure).

### 5.2 Stage `input` (`SymptomInput` component)

**Fields displayed:** `MedicalDisclaimerBanner` (static amber notice, see §11); heading "How are you feeling?"; **8 default quick-add chips** (Fever, Headache, Cough, Chest pain, Fatigue, Nausea, Stomach pain, Dizziness) always visible; a **"+27 more symptoms"** toggle reveals 27 additional named chips grouped by body system (general, neuro, respiratory, GI, musculoskeletal, skin, urinary, endocrine, mental health, ENT, eye — full list is in `SymptomInput.jsx`'s `CHIPS_EXTRA`). Tapping a chip appends its text to the end of the textarea (case-insensitive dedupe — won't add a chip whose text is already present).

**Editable field:**
| Field | Type | Validation |
|---|---|---|
| Symptom description | multi-line free text, auto-resizing height, hard-capped at **1000 chars** (input is truncated as you type past the cap), live counter "{count} / 1000" (turns orange past 850) | Minimum **10 trimmed characters** — while 1–9 chars are entered, a hint appears: "{N} more characters needed"; submit is disabled below 10. |

**Buttons / actions:**
- Chip buttons (local text-append only, no submit).
- "Show more / fewer symptoms" toggle (local UI state).
- **"Analyze Symptoms"** button (disabled while invalid/loading) — client re-validates length even though the button should already be disabled — dispatches `SUBMIT`, moving to the `analyzing` stage.
- **Ctrl+Enter / Cmd+Enter** keyboard shortcut also submits.

**Conditional UI:** inline red error banner shown when a prior `/api/analyze` call failed (message passed down from the page-level `inputError` state — the server's message, or a fallback).

### 5.3 Stage `analyzing` (`AnalyzingLoader`, cycling messages)

**View only:** pulsing stethoscope icon; message cycles every 2s through "Analyzing your symptoms…" → "Consulting medical AI…" → "Identifying conditions…" → "Finalizing diagnosis…"; 3 bouncing dots.

**Effect on entry:** **`POST /api/analyze`** `{symptoms}` (via `analyzeSymptoms`). On success, response is destructured into `{analysisId, source, ...diagnosis}` where `diagnosis = {disease, specialty, severity, urgency, description, recommendations[], redFlags[]}`. **The result is written to local history (`localStorage['medifind_history']`) immediately**, regardless of login state or whether the backend DB actually persisted it (`analysisId` may be `null` if the server DB write failed) — this is a deliberate resilience measure so History always reflects the result. Then moves to `diagnosis` stage. On failure: error extracted from `err.data?.message ?? err.message ?? 'Analysis failed. Please try again.'`, stored as the input-stage error, returns to `input` stage.

**Endpoint:** `POST /api/analyze`.

### 5.4 Stage `diagnosis` (`DiagnosisCard`, full actions shown)

**Fields displayed:**
- **Urgency indicator** at top: if `urgency === 'emergency'` → full red `EmergencyBanner` ("Seek Emergency Care Now" + explanatory text + 3 tap-to-dial buttons: 🇺🇸 911, 🌍 112, 🇮🇳 108). Otherwise a colored pill with icon + one of these exact labels based on `urgency` value: `self-care` → "Self-care — manageable at home"; `see-doctor-soon` → "See a Doctor — within the next few days"; `see-doctor-today` → "See a Doctor Today — do not delay"; `see-doctor` (or any unrecognized value) → "See a Doctor — schedule an appointment".
- Disease name (large heading), severity Badge (capitalized, mild/moderate/severe color-coded).
- Specialty pill: "Recommended: {specialty}".
- Description paragraph.
- "What to do" — bulleted `recommendations[]` list (only rendered if non-empty), each with a checkmark icon.
- "Watch for — seek help immediately if:" — bulleted `redFlags[]` list (only rendered if non-empty), orange styling.
- Static footer disclaimer.

**Buttons / actions:**
- **"🔍 Find Best Doctor Near Me"** → moves to `locating` stage.
- **"Start New Analysis"** → full reset (clears local-history ref + input error), back to `dashboard`.

**Also reused (with `hideActions`, no buttons) on AnalysisDetailPage** — see §7.

### 5.5 Stage `locating` (`LocationLoader`)

**View only:** pulsing concentric-ring map-pin animation; "Getting your location…" / "We'll use this to find nearby hospitals".

**Effect on entry** — calls `getCurrentLocation()` (`locationService.js`):
1. Returns a session-cached GPS fix if one was acquired within the **last 5 minutes**.
2. Else uses the **browser Geolocation API** (`navigator.geolocation.getCurrentPosition`, `enableHighAccuracy: true`, 20s timeout, 5-min `maximumAge`):
   - Success → `{lat, lng, accuracy, source:'gps'}`, cached 5 min.
   - Permission denied (code 1) or timeout (code 3) → falls back to **IP geolocation**: `fetch('https://ipapi.co/json/')` (8s abort) → `{lat, lng, accuracy:5000, source:'ip-fallback', city}`. If that also fails → a specific "permission denied" or "timed out" error message.
   - Position unavailable (code 2) → rejects directly with "Location unavailable. Make sure GPS or location services are enabled..." (no IP fallback attempted).
   - No `navigator.geolocation` at all → goes straight to IP fallback.
3. **If the resolved coords have `source === 'ip-fallback'`, the page treats this as an error**, not a success — dispatches to the `location-error` stage with a message explaining "GPS is unavailable on this connection (HTTP requires HTTPS for location access). IP-based location is too inaccurate for hospital search{ — detected city: X, if known}. Please enter your city below." Only a true GPS fix proceeds to `searching`.

**Web-only vs portable:** this entire flow is a **browser-security-model artifact** (HTTPS-gated Geolocation API, "click the lock icon" messaging) — Android needs a native reimplementation around `FusedLocationProviderClient` / runtime location permissions, not a literal port. The IP-fallback call itself (`ipapi.co`) is a plain HTTPS GET and ports as-is; it's the GPS-vs-IP decision logic and copy that must be redesigned for Android's permission model.

### 5.6 Stage `location-error` (`LocationErrorView`, two sub-modes)

**Default sub-mode:**
- Map-pin icon, "Location Access Needed" heading, the error message from stage 5.5.
- Static instructional box, **Chrome-specific**: "Click the 🔒 lock icon in the address bar → Site settings → set Location to Allow → then tap Try Again." — must be replaced with Android permission-settings copy/intents.
- **"Try Again"** button → re-enters the `locating` stage.
- **"📍 Use My City Instead"** button → switches to city sub-mode.

**City sub-mode:**
- **"← Back"** button (returns to default sub-mode).
- Editable field: free-text city name (no format validation beyond non-empty).
- **"🔍 Find Doctors in This City"** submit (disabled while empty/loading) → `geocodeCity(cityName)` → **`GET https://nominatim.openstreetmap.org/search?q={city}&format=json&limit=1`** (OpenStreetMap Nominatim, external public API; custom `User-Agent`/`Accept-Language` headers) → `{lat, lng, displayName, source:'city-search'}`. Success → coordinates are used directly, **skipping GPS entirely**, jumping straight to `searching`. Failure (city not found / network error) → inline error text under the field (e.g. `City "X" not found. Please check the spelling or try a nearby larger city.`).

**Endpoint:** `GET https://nominatim.openstreetmap.org/search` (external; ports as a direct REST call on Android).

### 5.7 Stage `searching` (`AnalyzingLoader`, fixed message)

**View:** same animated loader; message is "Searching nearby hospitals…" for the first 3 seconds, then switches to "Still searching — busy areas can take up to 20 seconds…" (a local 3000ms timer).

**Effect on entry:** `findBestDoctor(lat, lng, specialty, analysisId)` → **`POST /api/find-doctor`** `{lat, lng, specialty, analysisId}` → `{bestMatch, note, facilities, alternativesCount, source}`. If a local-history entry exists for this session (from stage 5.3) and a match was found, the local entry is **patched** with the flattened facility fields (see §12 for the exact field list) so History reflects the match even for guests. Success → `result` stage. Failure → `error` stage, message from `err.message` or a fallback.

**Endpoint:** `POST /api/find-doctor`.

### 5.8 Stage `result` (`BestMatchCard`, `onSearchAgain` present)

**Fields displayed:**
- Header: "Best Match Found", subtext "{source ?? 'OpenStreetMap'} · Searching for {recommendedSpecialty}" (specialty text only appears if the API response includes it).
- Optional amber **note** banner — shown when no exact specialty match was found nearby and the returned facility is instead the closest one of any type.
- Facility card: name + type Badge (hospital/clinic/doctors/facility, each a distinct color); distance in km (only if not null); address (only if present); opening hours (only if present); phone (only if present).
- **Match Score** bar (0–100, animated) + expandable **"Why this match?"** breakdown showing 4 sub-scores as progress bars: Specialty Match (/35), Distance (/40), Facility Type (/15), Completeness (/10) — plus an explanatory note ("Completeness is 0 because this facility has no phone, address, or hours listed in OpenStreetMap yet") specifically when completeness = 0.

**Buttons / actions:**
- **"📞 Call to Book"** — `tel:{phone}` link if a phone exists; else a static "Phone not listed — visit facility" block.
- **"🗺️ View on Map"** — opens `osmMapUrl` in a new tab (only if present).
- **"🧭 Directions"** — opens `directionsUrl` in a new tab (only if present).
- **"🌐 Website"** — opens `website` in a new tab (only if present).
- **"Download PDF Report"** — see the boxed callout below. **Web-only.**
- **"🔄 New Analysis"** text link (only present on HomePage, not on AnalysisDetailPage) → full reset back to `dashboard`.
- Static footer disclaimer.

> #### ⚠️ Web-only feature: PDF report generation
> `utils/generateReport.js` builds a complete styled **A4 HTML document client-side** (header, disclaimer, symptoms, diagnosis card with confidence bar/urgency/specialty pills, recommendations, home-care, red flags, "when to seek help", differential-diagnosis probability bars, facility card with score breakdown, footer with emergency numbers), opens it in a new tab as a `Blob` object URL, and **auto-triggers `window.print()`** ~600ms after load so the user picks "Save as PDF" from the browser's native print dialog. If the popup is blocked, it falls back to downloading the raw `.html` file via a synthetic `<a download>` click.
> This relies on `window.open`, `window.print()`, `Blob`/`URL.createObjectURL`, and the browser's print-to-PDF pipeline — **none of which exist on Android**. A native implementation needs either genuine PDF generation (`android.graphics.pdf.PdfDocument` or a PDF library) plus a share/save `Intent`, or a server-rendered PDF endpoint the app downloads. The **content** of the report (every field listed above, all sourced from the same `diagnosis`/`bestMatch` objects already on screen) should be preserved; only the generation mechanism needs to change.

**Also reused (without `onSearchAgain`) on AnalysisDetailPage** — see §7.

### 5.9 Stage `error` (page-local `ErrorView`)

**View:** warning icon, "Something went wrong" heading, the error message text.

**Button:** **"Try Again"** — if a diagnosis is already held in memory, jumps back to the `diagnosis` stage (so the user can retry "Find Doctor" without re-running the AI); otherwise does a full reset to `dashboard`.

---

## 6. HistoryPage — `/history`

**Chrome:** `TopBar` "Analysis History"; left back-arrow → `/`; right **"Clear All"** button (only rendered when there's ≥1 record) → opens a confirm dialog.

**Data source:** if logged in (`token` present), fetches **`GET /api/history?limit=50`** and uses `res.data.analyses`; on any failure (including being logged out) falls back to the local cache (`getHistory()` → `localStorage['medifind_history']`, max 50, newest-first). Runs on mount and whenever `token` changes.

**Empty state** (0 records): stethoscope icon, "No analyses yet" heading, description, **"🩺 Analyze Symptoms Now"** button → `/`, disclaimer footnote.

**List state** (≥1 record):
- Header: "**{N}** record(s)".
- Each row: icon, disease name (`disease` or "Unknown condition"), formatted "MMM d, yyyy • h:mm a", **facility name if one was found and saved for that entry** (`matchName`, teal 📍 prefix — only shown when present), severity Badge (or "—"), chevron / overflow menu.
- Row tap (anywhere except the menu button) → `/history/{id}`.
- **"…" overflow menu** per row → popover with **"View Details"** (same navigation) and **"Delete"** (opens a per-row confirm dialog). Closes on Escape, backdrop click, or re-tap.
- Footer note: "Last {min(total,50)} analyses · stored on this device".

**Actions / endpoints:**
- **Delete one:** if logged in, `DELETE /api/history/{id}` first; **always** also removes the local copy (`deleteAnalysis`); re-fetches the list; `toast.success('Analysis deleted.')` or error toast.
- **Clear All:** if logged in, fires `DELETE /api/history/{id}` for every currently-listed id in parallel (`Promise.allSettled` — partial failures don't block the rest), then wipes the entire local cache (`clearHistory()`, removes the `localStorage` key outright) and resets the in-memory list to `[]`; `toast.success('All analyses cleared.')` or error toast.

**Conditional UI:** empty vs list state; per-row menu open/closed; two `ConfirmDialog` modals (single-delete / clear-all) whose confirm-button label switches to "Deleting…"/"Clearing…" while the request is in flight.

**Endpoints:** `GET /api/history?limit=50`, `DELETE /api/history/:id` (repeated for Clear All).

**Note on local cap:** the local cache is hard-capped at **50 entries** (oldest evicted on overflow); the *first time ever* eviction happens, a one-time toast fires: "Older entries have been archived. Sign in to keep full history. 🗂️" (remembered via a separate `localStorage` flag so it never repeats). This cap/eviction only matters for guests — logged-in users see the server's un-capped list.

---

## 7. AnalysisDetailPage — `/history/:id`

**Loading sequence:** if a token exists, tries **`GET /api/history/{id}`** first; if that throws (or there's no token), falls back to the local cache (`getAnalysis(id)` — throws "Analysis not found in local history." if missing, caught and surfaced as `toast.error('Could not load this analysis.')`).

**Conditional UI states:**
- **Loading:** centered large spinner.
- **Not found** (`!analysis` after load completes): plain "Analysis not found." card.
- **Loaded:** full detail view (below).

**Fields displayed (loaded state):**
- Formatted date/time: "MMMM d, yyyy 'at' h:mm a".
- "Symptoms Reported" card — raw `symptoms` text as originally submitted.
- Diagnosis section — **same `DiagnosisCard` fields as §5.4**, fed from `disease/specialty/severity/urgency/description/recommendations/redFlags`, but with `hideActions` (no "Find Doctor"/"Start New Analysis" buttons here).
- Facility section — **only rendered if `matchName` is present** on the record. The flat DB-style fields (`matchName, matchAddress, matchPhone, matchWebsite, matchType, matchDistanceKm, matchLat, matchLng, matchOsmMapUrl, matchDirectionsUrl, matchScore, matchSpecialtyScore, matchDistanceScore, matchTypeScore, matchCompletenessScore`) are reconstructed into a `bestMatch` object and rendered through the **same `BestMatchCard` as §5.8** — all the same view fields and buttons apply (including the web-only PDF download), minus the "New Analysis" link.
- **"Delete This Analysis"** danger button.

**Actions:**
- Back arrow → `/history`.
- Delete → confirm dialog ("This analysis record and its PDF will be permanently deleted..."); on confirm: if logged in, `DELETE /api/history/{id}` first, then always also deletes locally, `toast.success('Analysis deleted.')`, navigate to `/history` (replace). Failure → error toast.

**Endpoints:** `GET /api/history/:id`, `DELETE /api/history/:id`.

---

## 8. ProfilePage — `/profile`

**Chrome:** `TopBar` "Profile"; back arrow → `/`.

**Fields displayed** (all read-only, sourced from `authStore.user` — populated at login/signup or by the `GET /api/auth/me` bootstrap call, **not** re-fetched on this page):
- Circular **initials avatar** generated from `user.name` (first letters of up to the first two words, uppercased) — **no photo upload anywhere in the app**.
- Name (`user.name`), Email (`user.email`).
- "Member since **{Month yyyy}**" — only shown if `user.createdAt` is present.

**Account section:**
- **"Edit Profile"** row → `/profile/edit`.
- **"Change Password"** row — label flips to "Sending reset link…" and disables itself while in flight. On tap: `authService.forgotPassword(user.email)` directly → **`POST /api/auth/forgot-password`** → `toast.success('Password reset link sent to your email!')` or error toast. This reuses the same flow as §3, but fires immediately using the logged-in user's own email (no navigation, no typing required).

**About section:**
- **"Privacy Policy"** row — `onPress` is a no-op (`() => {}`). **Not implemented.**
- **"Terms of Service"** row — `onPress` is a no-op. **Not implemented.**
- **"Medical Disclaimer"** row — toggles an inline expand/collapse panel with the full static legal disclaimer text (informational-only, not a diagnosis, always consult a professional, emergency numbers 108/112/911, no-liability statement).
- **"App Version"** row — static value `1.0.0`, no action.

**Support section:**
- **"Contact Support"** row → `window.open('mailto:medifindofficial@gmail.com')`.
- **"Report a Problem"** row → `window.open('mailto:medifindofficial@gmail.com?subject=Bug%20Report%20-%20MediFind%20App')`.

**Sign out:**
- **"Sign Out"** danger button → `authStore.logout()` (best-effort `POST /api/auth/logout` to clear the server-side cookie, failure ignored, then **always** clears local token + state), `toast.success('Signed out.')`, navigate to `/login` (replace).

**Endpoints:** `POST /api/auth/forgot-password` (Change Password), `POST /api/auth/logout` (Sign Out).

**Web-only vs portable:** `mailto:` links → Android `Intent.ACTION_SENDTO`, direct equivalent. Privacy Policy / Terms of Service are unimplemented placeholders on web too — flag as "needs real content," not something to copy as a no-op.

---

## 9. EditProfilePage — `/profile/edit`

**Fields displayed:** local form state pre-filled from `authStore.user.name` / `.email` on mount. A live **avatar preview** recalculates the initials from the in-progress `name` field as the user types ("Your initials update as you type" caption).

**Editable fields:**
| Field | Type | Notes |
|---|---|---|
| Full Name | text, `maxLength=60`, autoComplete `name` | No live per-keystroke error; gates Save (below). |
| Email Address | `type="email"`, autoComplete `email` | Static helper text: "Changing your email will require you to use the new address for future logins." No live error; gates Save. |

**Save-button gating (`canSave`):** requires **at least one field actually changed** from the original (compared via `.trim()`) **AND** `name.trim().length >= 2` **AND** `email.trim().includes('@')` — note this email check is **only a substring check**, much looser than the regex-based validation used on the auth pages.

**Buttons / actions:**
- **"Save Changes"** (primary, spinner while `authStore.isLoading`) — disabled unless `canSave`. On submit: `authStore.updateProfile(name.trim(), email.trim())` → **`PUT /api/auth/profile`** `{name, email}` → returns the updated safe user; the store re-applies it with the **existing token unchanged**. Success: inline green banner "Profile updated successfully!" + `toast.success('Profile updated!')`, then navigates to `/profile` after an **800ms delay**. Failure: inline red error banner with `err.message` (or a fallback).
- **"Cancel"** (ghost) → `/profile` directly, discarding changes.
- `TopBar` back button ("← Profile") → `/profile`.

**Conditional UI:** the green success banner and red error banner are mutually exclusive and reset — any further edit to either field clears the success banner; a new submit clears both banners before retrying.

**Footer note:** static reminder that password changes happen via "Change Password" on the Profile page — this page has **no password field at all**.

**Endpoint:** `PUT /api/auth/profile`.

---

## 10. Catch-all — `*`

Any unmatched path is immediately replaced with `<Navigate to="/" replace />` — no UI. (Which itself may then redirect to `/login` via `ProtectedRoute` if the user isn't authenticated.)

---

## 11. Cross-cutting UI (shared across multiple routes)

### SideDrawer (left-slide menu — reachable only via HomePage's hamburger icon)
- User info block (avatar + name + email from `authStore.user`), shown only if logged in.
- Nav items: **Home** (`/`), **History** (`/history`), **Profile** (`/profile`) — active route is highlighted.
- **"Sign Out"** footer button — identical `logout()` flow to ProfilePage.
- Static footer: "MediFind v1.0.0" + mailto support link.
- Dismiss via: X button, backdrop click, or Escape key. Body scroll is locked while open (a web-specific technique — native drawers don't need this, they simply render above other content).

### Shared low-level primitives (behavior worth preserving, visuals are app-specific)
- **`Badge`** — colored pill for severity/status labels (`mild`/`moderate`/`severe`/`default`/`success`/`warning`/`error`/`info`/`purple`); pure presentational.
- **`Button`** — variant (primary/secondary/danger/ghost) + size (sm/md/lg) + `loading` (spinner + auto-disable) + optional leading icon; pure presentational wrapper.
- **`Input` / `PasswordInput`** — labelled field with inline red error text underneath; `PasswordInput` adds a show/hide eye-icon toggle.
- **`TopBar`** — sticky header, centered title, left/right action slots; used on every non-auth page.
- **`BottomSheet` / `ConfirmDialog`** — modal primitive (slides from bottom on narrow viewports, centers on wide ones), closes on Escape/backdrop; `ConfirmDialog` is Confirm/Cancel preset over it (Confirm styled red when `danger`). Used for every delete/clear-all confirmation (HistoryPage ×2, AnalysisDetailPage ×1).
- **`Spinner`** — 3-size spinning loader; used for full-page loading (AnalysisDetailPage) and inside `Button`'s `loading` state.
- **`MedicalDisclaimerBanner`** — small amber inline notice ("⚕ MediFind provides AI-assisted information only… call 911/112/108"), shown on every auth page (via `AuthLayout`) and above the symptom-input form.
- **`AuthLayout`** — shared chrome for all 4 auth pages: logo/wordmark header, white card container with optional subtitle, and the disclaimer banner beneath the card.

### Dead code (present in the repo, not reachable from any route — noted for completeness only; do **not** port)
- `components/Header.jsx` — an alternate app header; not imported anywhere.
- `components/Loader.jsx` — a generic labelled spinner; not imported anywhere.
- `components/ErrorCard.jsx` — a generic error card with API-error-code-specific hint text; not imported anywhere (HomePage's inline `ErrorView` serves this purpose instead).
- `components/ui/Card.jsx` — a generic titled-card-with-footer wrapper; not imported anywhere (pages use a raw CSS class directly).
- `components/ui/EmptyState.jsx` — a generic icon/title/description/CTA block; not imported anywhere (HistoryPage/HomePage hand-roll their own empty states).
- `components/MedicalDisclaimerFull.jsx` — an expandable full-legal-text disclaimer; not imported anywhere (ProfilePage has its own inline duplicate, `DisclaimerExpanded`, instead).

---

## 12. localStorage keys (client-side persistence)

| Key | Contents |
|---|---|
| `medifind_token` | The auth token string. Read once into an in-memory cache at module load; every login/signup/logout mirrors both the cache and this key. |
| `medifind_history` | JSON array, **max 50 entries**, newest first. Each entry: `{id, createdAt, symptoms, disease, specialty, severity, urgency, description, recommendations[], redFlags[], matchName, matchAddress, matchPhone, matchWebsite, matchType, matchDistanceKm, matchLat, matchLng, matchOsmMapUrl, matchScore, matchDirectionsUrl, matchSpecialtyScore, matchDistanceScore, matchTypeScore, matchCompletenessScore}`. Kept in sync across browser tabs via a `storage` event listener (invalidates the in-memory cache when another tab writes to this key — **no Android equivalent needed**, there's no "other tab"). |
| `medifind_history_archive_notice_shown` | One-time flag so the "older entries archived" toast (§6) only ever fires once per browser/install. |

**Important behavioral note:** a **new analysis is always written to `medifind_history` first**, regardless of login state, as a resilience measure in case the backend DB write silently fails — so even logged-in users accumulate local entries in parallel with server-side ones, even though Dashboard/History/Detail all *prefer* the server list when logged in. Decide deliberately whether the Android app mirrors this dual-write pattern or relies solely on the server once authenticated.

---

## 13. Full endpoint reference

| Method | Endpoint | Called from | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | SignupPage | Create account, returns `{user, token}` |
| POST | `/api/auth/login` | LoginPage | Sign in, returns `{user, token}` |
| POST | `/api/auth/forgot-password` | ForgotPasswordPage, ProfilePage (Change Password) | Trigger reset email, returns generic `{message}` |
| POST | `/api/auth/reset-password` | ResetPasswordPage | Complete reset with emailed token |
| GET | `/api/auth/me` | App bootstrap (`authStore.loadUser`) | Fetch current user from a stored token |
| PUT | `/api/auth/profile` | EditProfilePage | Update name/email |
| POST | `/api/auth/logout` | ProfilePage, SideDrawer | Clear server-side HttpOnly cookie |
| POST | `/api/analyze` | HomePage (`analyzing` stage) | AI symptom analysis → diagnosis + `analysisId` |
| POST | `/api/find-doctor` | HomePage (`searching` stage) | Best-match facility search by coords + specialty |
| GET | `/api/history?limit=3` | HomePage Dashboard | Recent-analyses stats (logged-in only) |
| GET | `/api/history?limit=50` | HistoryPage | Full history list (logged-in only) |
| GET | `/api/history/:id` | AnalysisDetailPage | Single analysis detail (logged-in only) |
| DELETE | `/api/history/:id` | HistoryPage, AnalysisDetailPage | Delete one record (logged-in only) |
| GET | `https://nominatim.openstreetmap.org/search` | HomePage (city-fallback location search) | External geocoding (city name → lat/lng) |
| GET | `https://ipapi.co/json/` | locationService (GPS-denied fallback) | External IP-based geolocation |

Guest (logged-out) users never call the `/api/history*` or `/api/auth/logout` endpoints — everything falls back to the local `medifind_history` cache. `/api/analyze` and `/api/find-doctor` work identically whether logged in or not.

---

## 14. Web-only features vs. direct-port CRUD/display

| Feature | Why it's web-specific | What Android needs instead |
|---|---|---|
| **PDF report generation** (`generateReport.js`, "Download PDF Report" button) | `window.open` + `window.print()` + `Blob`/object URL + browser's print-to-PDF | Native PDF generation (`PdfDocument` or a library) + share/save `Intent`, or a server-rendered PDF endpoint. Report **content** (§5.8 box) should be preserved. |
| **Browser GPS** (`navigator.geolocation`) | Browser Geolocation API, HTTPS-gated | `FusedLocationProviderClient` + Android runtime location permissions |
| "Click the 🔒 lock icon…" location-denied copy | Chrome-address-bar-specific instructions | Android permission-settings copy/intent (e.g. `Settings.ACTION_APPLICATION_DETAILS_SETTINGS`) |
| `mailto:` links (Contact Support, Report a Problem, Forgot-Password footer) | Browser default-mail-handler navigation | `Intent.ACTION_SENDTO` |
| `tel:` links (Call to Book; 911/112/108 quick-dial) | Browser `tel:` URI | `Intent.ACTION_DIAL` / `ACTION_CALL` |
| `target="_blank"` map/directions/website links | Opens a new browser tab | `Intent.ACTION_VIEW` (opens the default maps/browser app) |
| Reset-password deep link (`?email=&token=` query params) | Clicked from an email in any browser | Android App Links / deep-link intent-filter |
| `localStorage` + cross-tab `storage` event sync | Browser storage API | `SharedPreferences`/`DataStore` + Room/SQLite for the history cache; the cross-tab sync listener has no mobile equivalent and can be dropped |
| Full-page redirect on 401 (`window.location.href`) | Browser navigation / page reload | Programmatic in-app navigation; no reload needed |
| IP-geolocation fallback (`ipapi.co`) | Plain HTTPS GET | Ports directly, unchanged |
| City geocoding (Nominatim) | Plain HTTPS GET | Ports directly, unchanged |
| **Everything else** — auth forms, dashboard, symptom input + chips, diagnosis display, best-match display + score breakdown, history list/detail, delete/clear-all, profile view/edit, drawer nav | Standard CRUD/display, client-side validation, local reducer/state-machine | Ports directly onto native equivalents (Compose/RecyclerView lists, forms, a ViewModel mirroring the `HomePage` reducer's 9 stages) |

---

*Document generated from a full read of `frontend-web/src/{App.jsx, pages/**, components/**, services/**, store/**, api/**, utils/**, constants.js}` on 2026-08-24. `android-app/` was not read or referenced in producing this document.*
