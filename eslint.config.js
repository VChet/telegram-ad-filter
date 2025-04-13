import neostandard from "neostandard";
import userscripts from "eslint-plugin-userscripts";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  globalIgnores(["tg-ad-filter.user.js"]),
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
      globals: { GM_configStruct: "readonly", ...globals.browser, ...globals.greasemonkey }
    },
    rules: {
      "arrow-parens": ["error", "always"],
      curly: ["error", "all"],
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/space-before-function-paren": ["error", "never"]
    }
  }
]);
