import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import typescript from "@rollup/plugin-typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = join(__dirname, "src", "main.ts");
const outputFile = join(__dirname, "tg-ad-filter.user.js");
const banner = fs.readFileSync("src/meta.txt", "utf-8");

export default {
  input,
  output: {
    file: outputFile,
    format: "es",
    banner
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" })
  ]
};
