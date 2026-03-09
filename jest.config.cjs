module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testTimeout: 700000,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["<rootDir>/dist/**/*.test.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!(p-timeout|p-retry|is-network-error)/)",
  ],
};
