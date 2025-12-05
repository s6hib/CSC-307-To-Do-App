import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // 1) Ignore built stuff
  globalIgnores(["dist", "coverage", "node_modules"]),

  // 2) Main React config
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module"
      }
    },
    rules: {
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^[A-Z_]" }
      ]
    }
  },

  // 3) EXTRA CONFIG FOR TEST FILES (including setupTests.js)
  {
    files: [
      "src/setupTests.js", // your file
      "**/*.test.{js,jsx,ts,tsx}" // normal test files
    ],
    languageOptions: {
      globals: {
        // browser globals if you use them
        ...globals.browser,
        // Node-style global object
        global: "writable",
        // Jest globals: jest, describe, it, test, expect, etc.
        ...globals.jest
      }
    }
  }
]);
