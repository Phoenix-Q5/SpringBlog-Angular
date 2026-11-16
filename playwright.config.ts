import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env['E2E_PORT'] ?? 4200);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('E2E_PORT must be an integer between 1 and 65535');
}
const baseURL = `http://127.0.0.1:${port}`;
const production = process.env['E2E_PRODUCTION'] === '1';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: `npm start -- --host 127.0.0.1 --port ${port}${production ? ' --configuration production' : ''}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000
  }
});
