import * as dotenv from "dotenv";
import { defineConfig } from "tsup";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
  external: ["react", "react/jsx-runtime"],
});
