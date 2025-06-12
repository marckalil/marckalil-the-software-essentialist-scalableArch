import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "Backend (E2E)",
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  testMatch: ["**/tests/e2e/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  setupFilesAfterEnv: ["<rootDir>/tests/.jestSetup.ts"],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  testTimeout: 30000,
  collectCoverage: false,
};

export default config;
