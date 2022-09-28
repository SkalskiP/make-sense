import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  rootDir: process.cwd(),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [],
  testEnvironment: 'jsdom',
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/configureTest.ts"],
  transform: {
    "^.+(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  "moduleNameMapper": {
    "\\.(css|scss|less)$": "identity-obj-proxy"
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
  ],
};
export default config;
