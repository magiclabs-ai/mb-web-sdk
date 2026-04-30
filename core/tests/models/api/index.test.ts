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
    expect((api.fetcher.options as FetchOptions).headers.Authorization).toEqual(`Api-key ${apiKey}`);
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

  test("ws.open function", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });
    // @ts-ignore
    api.ws.designerWS?.connection?.open();
    // @ts-ignore
    api.ws.analyzerWS?.connection?.open();
    // @ts-ignore
    const designerSpy = vi.spyOn(api.ws.designerWS, "connect");
    // @ts-ignore
    const analyzerSpy = vi.spyOn(api.ws.analyzerWS, "connect");
    const res = await api.ws.open();
    expect(res.areConnectionsOpen).toBe(true);
    expect(res.hasReachedMaxReconnectionAttempts).toBe(false);
    expect(designerSpy).toHaveBeenCalled();
    expect(analyzerSpy).toHaveBeenCalled();
    expect(api.ws.designerWS?.isConnectionOpen()).toBe(true);
    expect(api.ws.analyzerWS?.isConnectionOpen()).toBe(true);
  });

  test("debounces transient areConnectionsOpen: false", async () => {
    vi.useFakeTimers();
    try {
      const api = new MagicBookAPI({ apiKey: "fake key" });
      // @ts-ignore
      api.ws.analyzerWS?.connection?.open();
      // @ts-ignore
      api.ws.designerWS?.connection?.open();

      const events: Array<boolean> = [];
      const handler = (e: Event) => {
        const detail = (e as CustomEvent<{ result: { areConnectionsOpen: boolean } }>).detail;
        events.push(detail.result.areConnectionsOpen);
      };
      window.addEventListener("MagicBook", handler);

      // Drop one socket, then bring it back within the debounce window.
      // @ts-ignore
      api.ws.analyzerWS.connection.readyState = WebSocket.CLOSED;
      api.onConnectionStateChange();
      vi.advanceTimersByTime(100);
      // @ts-ignore
      api.ws.analyzerWS.connection.readyState = WebSocket.OPEN;
      api.onConnectionStateChange();
      vi.advanceTimersByTime(500);

      window.removeEventListener("MagicBook", handler);
      // No false should have been emitted during the transient drop.
      expect(events).not.toContain(false);
    } finally {
      vi.useRealTimers();
    }
  });

  test("emits hasReachedMaxReconnectionAttempts only once across both sockets", async () => {
    const api = new MagicBookAPI({ apiKey: "fake key" });

    const events: Array<{ areConnectionsOpen: boolean; hasReachedMaxReconnectionAttempts: boolean }> = [];
    const handler = (e: Event) => {
      events.push(
        (
          e as CustomEvent<{
            result: { areConnectionsOpen: boolean; hasReachedMaxReconnectionAttempts: boolean };
          }>
        ).detail.result,
      );
    };
    window.addEventListener("MagicBook", handler);

    // Simulate both sockets exhausting their retry budget. Each WS would normally fire
    // onConnectionStateChange twice on terminal close (once from handleClose, once from
    // the max-attempts branch); with two sockets that's four calls — consumers should
    // still see exactly one terminal event.
    // @ts-ignore — force the flag the way ws.ts would on max attempts
    api.ws.analyzerWS.maxReconnectionAttemptsReached = true;
    api.onConnectionStateChange();
    api.onConnectionStateChange();
    // @ts-ignore
    api.ws.designerWS.maxReconnectionAttemptsReached = true;
    api.onConnectionStateChange();
    api.onConnectionStateChange();

    window.removeEventListener("MagicBook", handler);
    const terminal = events.filter((e) => e.hasReachedMaxReconnectionAttempts);
    expect(terminal).toHaveLength(1);
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
