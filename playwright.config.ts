import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    headless: false,
    viewport: { width: 1280, height: 800 },
    video: 'on',
    screenshot: 'only-on-failure',
  },
});
