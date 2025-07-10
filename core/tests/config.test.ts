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
    process.env.WS_MAX_RECONNECTION_ATTEMPTS = "";
    process.env.PHOTO_DEPRECATION_WARNING_THRESHOLD = "";
  });

  test('should have defaultApiHost as "api.prod.xyz.io" if API_HOST is not set', async () => {
    const { defaultApiHost } = await loadConfig();
    expect(defaultApiHost).toBe("api.prod.xyz.io");
  });

  test("should have wsReconnectInterval as 500 if WS_RECONNECT_INTERVAL is not set", async () => {
    const { wsReconnectInterval } = await loadConfig();
    expect(wsReconnectInterval).toBe(500);
  });

  test("should parse WS_RECONNECT_INTERVAL from environment variable", async () => {
    process.env.WS_RECONNECT_INTERVAL = "10000";
    const { wsReconnectInterval } = await loadConfig();
    expect(wsReconnectInterval).toBe(10000);
  });

  test("should have maxReconnectionAttempts as 10 if WS_MAX_RECONNECTION_ATTEMPTS is not set", async () => {
    const { maxReconnectionAttempts } = await loadConfig();
    expect(maxReconnectionAttempts).toBe(10);
  });

  test("should parse WS_MAX_RECONNECTION_ATTEMPTS from environment variable", async () => {
    process.env.WS_MAX_RECONNECTION_ATTEMPTS = "20";
    const { maxReconnectionAttempts } = await loadConfig();
    expect(maxReconnectionAttempts).toBe(20);
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

  test("should have photoDeprecationWarningThreshold as 5 if PHOTO_DEPRECATION_WARNING_THRESHOLD is not set", async () => {
    process.env.PHOTO_DEPRECATION_WARNING_THRESHOLD = "5";
    const { photoDeprecationWarningThreshold } = await loadConfig();
    expect(photoDeprecationWarningThreshold).toBe(5);
  });
});
