import { describe, expect, test, vi } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { fetchMocker } from "@/core/tests/mocks/fetch";
import type { FetchOptions } from "@/core/models/fetcher";

describe("API", () => {
  test("apiKey is used properly", async () => {
    const apiKey = "fake key2";
    const api = new MagicBookAPI({
      apiKey,
    });
    expect((api.fetcher.options as FetchOptions).headers.Authorization).toEqual(`API-Key ${apiKey}`);
  });
  test("without apiKey", async () => {
    const api2 = new MagicBookAPI({
      mock: true,
    });
    expect((api2.fetcher.options as FetchOptions).headers.Authorization).toBeUndefined();
  });
  test.fails("With fake WS Endpoint", async () => {
    fetchMocker.mockResponse(JSON.stringify({}));

    const api = new MagicBookAPI({
      apiKey: "fake key",
    });

    expect(await api.photos.analyze([])).toStrictEqual("ws-connection-not-open");
  });
  test("onConnectionOpened function in mock mode", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });
    api.onConnectionOpened();
  });

  test("onConnectionOpened function", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });
    const test = vi.spyOn(api, "onConnectionOpened");

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 100);
    });

    expect(test).toBeCalled();
  });
});
