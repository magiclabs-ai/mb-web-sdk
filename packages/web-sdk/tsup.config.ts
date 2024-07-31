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
    API_HOST: process.env.API_HOST || "",
    WEBSOCKET_HOST: process.env.WEBSOCKET_HOST || "",
  },
  target: "esnext",
  outDir: "dist",
});
