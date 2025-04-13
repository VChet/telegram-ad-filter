import { build } from "esbuild";
import config from "./esbuild.config.js";

build(config).catch(() => process.exit(1));
