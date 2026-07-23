import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

export default defineConfig({
  banner: { js: readFileSync("src/meta.txt", "utf-8") },
  format: "cjs",
  outputOptions: { dir: ".", entryFileNames: "tg-ad-filter.user.js" }
});
