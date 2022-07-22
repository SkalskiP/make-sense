import "@testing-library/jest-dom";
const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length)
  }
});