import standard from "eslint-config-standard";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default [
  ...compat.config(standard),
  ...compat.config({
    overrides: [{
      files: ["*.user.js"],
      extends: ["plugin:userscripts/recommended"]
    }]
  }),
  {
    languageOptions: {
      parserOptions: { ecmaVersion: "latest" },
      globals: { GM_config: "readonly", ...globals.browser, ...globals.greasemonkey }
    },
    rules: {
      "max-len": ["warn", { code: 120 }],
      "no-console": ["warn", { allow: ["error"] }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "space-before-function-paren": ["error", "never"]
    }
  }
];
