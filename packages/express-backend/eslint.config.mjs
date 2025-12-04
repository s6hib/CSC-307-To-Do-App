export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: [
      "node_modules",
      "coverage",
      "dist",
      "build",
      "**/node_modules/**",
      "**/coverage/**",
      "**/dist/**",
      "**/build/**"
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    rules: {}
  }
];
