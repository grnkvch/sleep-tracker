import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:4175',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node scripts/serve-profiles.mjs',
    url: 'http://127.0.0.1:4175/',
    reuseExistingServer: true,
    timeout: 20_000
  }
});
