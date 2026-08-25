// frontend-web/e2e/full-flow.spec.js
// Full end-to-end flow against a REAL running backend + REAL Postgres (see
// .github/workflows/medifind-ci.yml, job web-e2e-tests, for how CI starts
// both). No mocking at the browser level — this exercises the actual
// signup → login → analyze → find-doctor → history → logout path a real
// user would take.
import { test, expect } from '@playwright/test'

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`
}

test.describe('MediFind — full user flow', () => {
  test('homepage redirects an unauthenticated visitor to /login without erroring', async ({ page }) => {
    const consoleErrors = []
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('the medical disclaimer is visible on the signup page', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByText(/medical disclaimer/i).first()).toBeVisible()
  })

  test('sign up → login → symptoms → diagnosis → find doctor → history → logout', async ({ page, context }) => {
    // 30s (the config default) is tight even in the best case: signup + login
    // + analysis + a real Overpass call (measured worst-case ~23s: 15s primary
    // timeout + 8s retry — see backend/routes/findDoctor.js) + history + logout.
    test.setTimeout(60_000)

    const email = uniqueEmail()

    // ── Sign up ──────────────────────────────────────────────────────────
    await page.goto('/signup')
    await page.getByLabel('Full name').fill('E2E Test User')
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Password', { exact: true }).fill('testpass123')
    // force: true — this checkbox is a real <input type="checkbox" className="sr-only">
    // sitting behind a styled sibling <div> (see SignupPage.jsx's custom-checkbox
    // pattern); sr-only clips it to 1x1px, so Playwright's actionability check
    // (visible + not obscured) correctly refuses a plain .check() here. The
    // component itself is fine as-is for real users — only the test needs to
    // bypass that check and dispatch the click directly to the input.
    await page.getByLabel(/agree to medical disclaimer/i).check({ force: true })
    await page.getByRole('button', { name: 'Create Account' }).click()

    // Signup logs the user straight in and redirects home.
    await expect(page).toHaveURL('/')
    await expect(page.getByText(/good (morning|afternoon|evening)/i)).toBeVisible()

    // ── Medical disclaimer visible on the home dashboard too ───────────────
    await expect(page.getByText(/medical disclaimer|ai-assisted information only/i).first()).toBeVisible()

    // ── Enter symptoms → see diagnosis ──────────────────────────────────────
    await page.getByRole('button', { name: 'Analyze Symptoms' }).click()
    await page.getByLabel('Symptom description').fill(
      'I have had a fever of 38.5C for two days with a dry cough and mild sore throat'
    )
    await page.getByRole('button', { name: 'Analyze Symptoms' }).click()

    // The diagnosis card renders the disease name as a level-2 heading.
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('button', { name: /find best doctor near me/i })).toBeVisible()

    // ── Find doctor (real geolocation → real backend → real Overpass) ──────
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 13.0827, longitude: 80.2707 }) // Chennai — dense OSM coverage
    await page.getByRole('button', { name: /find best doctor near me/i }).click()

    // Overpass's public instance is unreliable from GitHub Actions runners
    // (confirmed directly against the live API — see the diagnostic in this
    // repo's history around backend/utils/ranking.js's disqualification
    // fixes). This test verifies the app handles the search without
    // crashing or hanging — not that Overpass actually returns data. Any
    // handled state counts as a pass: a matched facility, a graceful
    // "no exact match" note, or the app's own error screen (HomePage.jsx's
    // ErrorView always renders "Something went wrong" as its heading,
    // regardless of the underlying error, on any rejected find-doctor call —
    // OVERPASS_TIMEOUT/OVERPASS_RATE_LIMITED/OVERPASS_UNAVAILABLE/NO_RESULTS
    // all reach it the same way). What must NOT happen is a stuck spinner.
    await expect(
      page.getByText(/km away|no exact specialty match|no nearby facilities|something went wrong|map service|could not reach|no nearby/i).first()
    ).toBeVisible({ timeout: 30_000 })

    // ── History shows the analysis just created ─────────────────────────────
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('link', { name: 'History' }).click()
    await expect(page).toHaveURL(/\/history/)
    await expect(page.getByText(/fever/i).first()).toBeVisible()

    // ── Logout ───────────────────────────────────────────────────────────
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('button', { name: 'Sign Out' }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
