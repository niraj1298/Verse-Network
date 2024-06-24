module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/*.config.js",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  displayName: "your-project-name",
  globalSetup: "./setupTests.js",
  globalTeardown: "./teardownTests.js",
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/fileTransform.js",
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
  watchPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
