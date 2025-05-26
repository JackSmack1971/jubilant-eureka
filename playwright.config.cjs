const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.{js,cjs}', // Run files ending with .spec.js or .spec.cjs
  testIgnore: '**/*.unit.spec.{js,cjs}', // Ignore files ending with .unit.spec.js or .unit.spec.cjs
  use: {
    baseURL: 'http://localhost:3000', // 'serve' is running on this port
  },
  webServer: {
    command: 'npx serve .',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
    stdout: 'ignore',
    stderr: 'ignore',
  },
});