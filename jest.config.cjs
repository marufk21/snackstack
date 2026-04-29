const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Project root (where next.config.ts and package.json live)
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["<rootDir>/__tests__/**/*.test.{ts,tsx,js,jsx}"],
};

module.exports = createJestConfig(customJestConfig);

