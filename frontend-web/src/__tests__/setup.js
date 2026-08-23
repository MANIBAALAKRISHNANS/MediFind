// Runs before every test file (see vitest.config.js → test.setupFiles).
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees between tests so one test's DOM doesn't leak into the next.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
