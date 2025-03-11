/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/core", replacement: path.resolve(__dirname, "../../core") },
      { find: "@/client", replacement: path.resolve(__dirname, "../../packages/client") },
      { find: "@/cli", replacement: path.resolve(__dirname, "../../packages/cli") },
    ],
  },
  test: {
    setupFiles: ["./core/tests/mocks/fetch.ts", "./core/tests/mocks/websocket.ts", "./core/tests/mocks/logger.ts"],
    exclude: ["node_modules", "packages"],
    environment: "jsdom",
    coverage: {
      all: true,
      include: ["core/**/*.ts"],
      exclude: ["core/tests/**/*.ts", "core/data/**/*.ts"],
      provider: "istanbul",
      reporter: ["text", "json-summary", "json", "html"],
    },
  },
});
