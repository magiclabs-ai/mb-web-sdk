import { describe, expect, test, beforeEach, vi } from "vitest";

// Function to reload the module
function loadConfig() {
  // Clear the module cache to ensure the module is re-imported
  vi.resetModules();
  // Re-import the module
  return import("../config");
}

describe("config", () => {
  beforeEach(() => {
    process.env.API_HOST = "";
    process.env.WS_RECONNECT_INTERVAL = "";
    process.env.DEFAULT_TIMEOUT = "";
  });

  test('should have defaultApiHost as "api.prod.xyz.io" if API_HOST is not set', async () => {
    const { defaultApiHost } = await loadConfig();
    expect(defaultApiHost).toBe("api.prod.xyz.io");
  });

  test("should have wsReconnectInterval as 5000 if WS_RECONNECT_INTERVAL is not set", async () => {
    const { wsReconnectInterval } = await loadConfig();
    expect(wsReconnectInterval).toBe(5000);
  });

  test("should parse WS_RECONNECT_INTERVAL from environment variable", async () => {
    process.env.WS_RECONNECT_INTERVAL = "10000";
    const { wsReconnectInterval } = await loadConfig();
    expect(wsReconnectInterval).toBe(10000);
  });

  test("should use API_HOST from environment variable", async () => {
    process.env.API_HOST = "api.example.com";
    const { defaultApiHost } = await loadConfig();
    expect(defaultApiHost).toBe("api.example.com");
  });

  test("should parse DEFAULT_TIMEOUT from environment variable", async () => {
    process.env.DEFAULT_TIMEOUT = "10000";
    const { defaultTimeout } = await loadConfig();
    expect(defaultTimeout).toBe(10000);
  });
});
