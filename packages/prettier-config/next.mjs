/**
 * @type {import("prettier").Config & import('prettier-plugin-tailwindcss').PluginOptions}
 */

const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "none",
  semi: false,
  printWidth: 120,
  useTabs: true,
  tabWidth: 2,
  arrowParens: "avoid",
};

export default config;
