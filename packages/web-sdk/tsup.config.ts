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
    WS_HEARTBEAT_INTERVAL: process.env.WS_HEARTBEAT_INTERVAL!,
    WS_TTL_REFRESH_INTERVAL: process.env.WS_TTL_REFRESH_INTERVAL!,
    WS_PONG_TIMEOUT: process.env.WS_PONG_TIMEOUT!,
    WS_FORCE_CLOSE_GRACE_PERIOD: process.env.WS_FORCE_CLOSE_GRACE_PERIOD!,
    WS_CONNECTION_DOWN_DEBOUNCE: process.env.WS_CONNECTION_DOWN_DEBOUNCE!,
  },
  target: "esnext",
  outDir: "dist",
});
