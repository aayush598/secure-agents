/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals','plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};
