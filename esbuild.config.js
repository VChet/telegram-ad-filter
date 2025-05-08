import { readFileSync } from "node:fs";

const banner = { js: readFileSync("src/meta.txt", "utf-8") };

const config = {
  entryPoints: ["./src/main.ts"],
  outfile: "tg-ad-filter.user.js",
  banner,
  bundle: true,
  platform: "node",
  format: "esm",
  logLevel: "info"
};

export default config;
