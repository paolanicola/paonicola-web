// @ts-check
const { defineConfig, devices } = require('@playwright/test')

/**
 * Playwright E2E config for the paonicola-web frontend.
 * Starts the CRA dev server automatically; point the app at the Dockerized
 * Rails backend (http://localhost:3001) via .env.local for full-stack runs.
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // The dev Rails backend (single process, small DB pool) chokes above ~4
  // parallel contexts; keep local parallelism modest.
  workers: process.env.CI ? 1 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:3000',
    timeout: 180 * 1000,
    reuseExistingServer: !process.env.CI,
    env: { BROWSER: 'none' },
  },
})
