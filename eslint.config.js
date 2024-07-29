import neostandard from "neostandard";
import userscripts from "eslint-plugin-userscripts";
import globals from "globals";

export default [
  ...neostandard(),
  {
    files: ["*.user.js"],
    plugins: { userscripts: { rules: userscripts.rules } },
    rules: { ...userscripts.configs.recommended.rules },
    settings: { userscriptVersions: { violentmonkey: "*" } }
  },
  {
    languageOptions: {
      parserOptions: { ecmaVersion: "latest" },
      globals: { GM_config: "readonly", ...globals.browser, ...globals.greasemonkey }
    },
    rules: {
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/space-before-function-paren": ["error", "never"]
    }
  }
];
