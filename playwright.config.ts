import { defineConfig, devices } from '@playwright/test';

export const STORAGE_STATE = 'utils/storageState.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html'], ['json', { outputFile: 'results.json' }]],
  timeout: 30 * 1000,
  use: {
    baseURL: 'https://www.saucedemo.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/, // Matches the file we created earlier
    },
    { name: 'chromium', 
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE,},
      dependencies: ['setup'],
    },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    //{ name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
});
    