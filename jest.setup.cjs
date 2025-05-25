// Polyfill for TextEncoder and TextDecoder for JSDOM environment
// This is often needed when running tests that use 'jsdom'
// and encounter 'ReferenceError: TextEncoder is not defined'
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

require('@testing-library/jest-dom');