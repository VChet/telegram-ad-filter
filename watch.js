import { context } from "esbuild";
import config from "./esbuild.config.js";

const ctx = await context(config);
await ctx.watch();
