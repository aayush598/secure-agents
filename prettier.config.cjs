/** @type {import("prettier").Config} */
module.exports = {
  /* Core formatting */
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  /* JSX / React */
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,

  /* Imports & objects */
  arrowParens: 'always',
  quoteProps: 'as-needed',

  /* Line endings (important for CI + cross-OS) */
  endOfLine: 'lf',

  /* Markdown */
  proseWrap: 'preserve',

  /* JSON */
  jsonRecursiveSort: false,

  /* TailwindCSS class sorting (IMPORTANT) */
  plugins: ['prettier-plugin-tailwindcss'],

  /* File-specific overrides */
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};
