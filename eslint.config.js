import neostandard from "neostandard";
import userscripts from "eslint-plugin-userscripts";

export default [
  ...neostandard({
    ts: true,
    noJsx: true,
    semi: true,
    env: ["browser", "greasemonkey"],
    ignores: ["*.user.js", "**/types/GM_config.ts"]
  }),
  {
    files: ["*.user.js"],
    plugins: { userscripts: { rules: userscripts.rules } },
    rules: { ...userscripts.configs.recommended.rules },
    settings: { userscriptVersions: { violentmonkey: "*" } }
  },
  {
    rules: {
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/space-before-function-paren": ["error", "never"]
    }
  }
];
