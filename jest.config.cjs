/** @type {import('jest').Config} */
const fs = require('fs');
const path = require('path');

const htmlFilePath = path.resolve(__dirname, 'index.html');
const html = fs.readFileSync(htmlFilePath, 'utf8');

const config = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
    resources: 'usable',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    html: html,
  },
  testMatch: [
    "**/tests/features/contact-integration-system.cjs",
    "**/tests/linting/stylelint.cjs"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/broken-link-checker.cjs",
    "/tests/html-validator.cjs",
    "/tests/accessibility-checker.cjs" // This is also a utility, not a Jest test suite
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};

module.exports = config;