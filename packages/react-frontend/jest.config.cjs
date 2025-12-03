/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jest-environment-jsdom",

  // runs BEFORE test files (polyfills)
  setupFiles: [require.resolve("./jest.polyfills.cjs")],

  // runs AFTER env is set up (jest-dom matchers)
  setupFilesAfterEnv: [require.resolve("./src/setupTests.js")],

  // transpile JS/JSX
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },

  // stub CSS & images
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(png|jpe?g|gif|webp|avif|svg)$": require.resolve(
      "./__mocks__/fileMock.cjs"
    )
  }
};
