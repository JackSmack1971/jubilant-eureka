import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js', // Only run files ending with .spec.js
  testIgnore: '**/*.unit.spec.js', // Ignore files ending with .unit.spec.js
  use: {
    baseURL: 'http://localhost:3000', // 'serve' is running on this port
  },
});