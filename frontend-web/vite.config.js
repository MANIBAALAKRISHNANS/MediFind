import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  // mkcert gives `vite dev`/`vite preview` a locally-trusted HTTPS cert —
  // needed for testing things that require a secure context (geolocation,
  // PWA install) locally, but it's actively harmful in CI: GitHub Actions
  // sets CI=true in every job's environment automatically, and the Web E2E
  // Tests job (.github/workflows/medifind-ci.yml) starts `vite preview` and
  // expects it on plain HTTP (its health-check step polls
  // http://localhost:4173, and playwright.config.js's baseURL is
  // E2E_BASE_URL, also http://localhost:4173) — with mkcert active there,
  // preview serves HTTPS instead, so the health check can never connect and
  // the job times out after 30s. Skipping mkcert in CI also drops the
  // "Downloading mkcert binary…" step from every run.
  plugins: [react(), !process.env.CI && mkcert()].filter(Boolean),
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
