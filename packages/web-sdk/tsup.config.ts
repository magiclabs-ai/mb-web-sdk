import * as dotenv from "dotenv";
import { defineConfig } from "tsup";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  env: {
    API_HOST: process.env.API_HOST!,
    WS_RECONNECT_INTERVAL: process.env.WS_RECONNECT_INTERVAL!,
    DEFAULT_TIMEOUT: process.env.DEFAULT_TIMEOUT!,
  },
  target: "esnext",
  outDir: "dist",
});
