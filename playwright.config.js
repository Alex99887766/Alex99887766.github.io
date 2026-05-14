import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: /.*\.e2e\.test\.js/,
  
  testDir: './tests',

  use: {
    baseURL: 'http://localhost:5173/',
    viewport: { width: 1280, height: 720 },
    screenshot: 'on', 
    video: 'on', 
    trace: 'on',
  },
  reporter: 'html',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});