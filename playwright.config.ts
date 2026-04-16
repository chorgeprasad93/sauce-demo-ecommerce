import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export const STORAGE_STATE = 'playwright/.auth/storageState.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html'], ['github'], ['json', { outputFile: 'results.json' }]],
  timeout: 30 * 1000,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }, 
    },
    { name: 'chromium', 
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE,},
      dependencies: ['setup'],
      testMatch: '**/*.spec.ts',
    },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    //{ name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
});
    