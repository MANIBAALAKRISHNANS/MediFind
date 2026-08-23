import { defineConfig, devices } from '@playwright/test'

// CI (backend + frontend already started by the workflow — see
// .github/workflows/medifind-ci.yml, job web-e2e-tests) sets E2E_BASE_URL to
// the plain-HTTP static server serving dist/. Locally, defaults to Vite's
// dev server, which serves HTTPS via vite-plugin-mkcert's self-signed cert.
const baseURL = process.env.E2E_BASE_URL || 'https://localhost:5173'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,   // signup/login flows share a real backend + DB — keep sequential
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Local dev server uses vite-plugin-mkcert's self-signed cert — harmless
    // to trust here since this only ever points at localhost.
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
