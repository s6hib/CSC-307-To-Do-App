module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__test__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/__test__/setup-db.js"],
  testTimeout: 20000
};
