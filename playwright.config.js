import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'http://127.0.0.1:4000'
  },

  webServer: {
    command: 'cd server && PORT=4000 npm start',
    url: 'http://127.0.0.1:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});