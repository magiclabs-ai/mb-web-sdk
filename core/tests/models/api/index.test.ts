import { beforeEach, describe, expect, test, vi } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { fetchMocker } from "@/core/tests/mocks/fetch";
import type { FetchOptions } from "@/core/models/fetcher";
import { projectFactory } from "@/core/factories/project";
import { densitiesSchema } from "@/core/models/api";
import { addEventMock, finishMock } from "../../mocks/dispatcher";

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

  test("onConnectionStateChange function in mock mode", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });
    api.onConnectionStateChange();
  });

  test("reconnectWS function", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });
    // @ts-ignore
    api.designerWS?.connection?.open();
    // @ts-ignore
    api.analyzerWS?.connection?.open();
    // @ts-ignore
    const designerSpy = vi.spyOn(api.designerWS, "connect");
    // @ts-ignore
    const analyzerSpy = vi.spyOn(api.analyzerWS, "connect");
    const res = await api.reconnectWS();
    expect(res.areConnectionsOpen).toBe(true);
    expect(designerSpy).toHaveBeenCalled();
    expect(analyzerSpy).toHaveBeenCalled();
    expect(api.designerWS?.isConnectionOpen()).toBe(true);
    expect(api.analyzerWS?.isConnectionOpen()).toBe(true);
  });

  test("bodyParse function", async () => {
    console.time("bodyParse");
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });
    const body = projectFactory();
    api.bodyParse(body);
    console.timeEnd("bodyParse");
  });
});

describe("Image densities", () => {
  beforeEach(() => {
    addEventMock.mockClear();
    finishMock.mockClear();
  });

  test("imageDensities", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });

    const res = await api.imageDensities("sku", 10, "low");
    expect(densitiesSchema.parse(res)).toStrictEqual(res);
  });

  test("imageDensities with error", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });

    await expect(api.imageDensities("sku", 10, "low")).rejects.toThrow();
    expect(addEventMock).toHaveBeenCalled();
  });
});
