module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { useESM: true }
    ],
    "^.+\\.jsx?$": "babel-jest"
  },

  transformIgnorePatterns: [
    "/node_modules/(?!p-retry|is-network-error)"
  ],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};
