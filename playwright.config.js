import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'http://127.0.0.1:4101'
  },

  webServer: {
    command: 'cd client && npm run build && cd ../server && npm start',
    url: 'http://127.0.0.1:4101',
    reuseExistingServer: true,
    timeout: 120 * 1000
  }
});