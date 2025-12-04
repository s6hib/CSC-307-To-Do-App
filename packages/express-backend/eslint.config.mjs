export default [
  {
    ignores: [
      "node_modules",
      "coverage",
      "dist",
      "build",
      "**/node_modules/**",
      "**/coverage/**",
      "**/dist/**",
      "**/build/**"
    ]
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    rules: {}
  }
];
