// Separate from vite.config.js deliberately — vite.config.js's mkcert plugin
// generates local HTTPS certs for the dev server, which is irrelevant to
// (and would slow down / could fail in) a CI unit-test run.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment:  'jsdom',
    globals:      true,
    setupFiles:   ['./src/__tests__/setup.js'],
    css:          false,
    // Scope discovery to src/__tests__ only — vitest's default glob also
    // matches e2e/*.spec.js (Playwright's suite), and the two test runners'
    // test()/describe() globals collide if vitest tries to load Playwright
    // spec files.
    include: ['src/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
})
