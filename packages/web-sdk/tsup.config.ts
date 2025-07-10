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
    WS_MAX_RECONNECTION_ATTEMPTS: process.env.WS_MAX_RECONNECTION_ATTEMPTS!,
    DEFAULT_TIMEOUT_DELAY: process.env.DEFAULT_TIMEOUT_DELAY!,
    PHOTO_DEPRECATION_WARNING_THRESHOLD: process.env.PHOTO_DEPRECATION_WARNING_THRESHOLD!,
  },
  target: "esnext",
  outDir: "dist",
});
