import { beforeEach, describe, expect, test, vi } from "vitest";
import { WS } from "../../models/ws";

describe("WS", () => {
  let ws: WS;
  const url = "ws://localhost:8080";

  beforeEach(() => {
    ws = new WS(url, () => {});
  });

  test("should initialize with the correct URL", () => {
    expect(ws).toBeInstanceOf(WS);
  });

  test("should establish a WebSocket connection", () => {
    expect(ws.isConnectionOpen()).toBe(false);
    ws.connection = { readyState: 1 } as WebSocket;
    expect(ws.isConnectionOpen()).toBe(true);
  });

  test("should reconnect on close", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const connectSpy = vi.spyOn(ws as any, "connect");
    ws.connection?.onclose?.(new CloseEvent("close"));
    vi.advanceTimersToNextTimer();
    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  test("should dispatch a custom event on message", () => {
    const eventDetail = {
      event_name: "test_event",
      result: "test_result",
      request: {
        clientId: "test_client",
        url: "test_url",
      },
    };
    const messageEvent = new MessageEvent("message", {
      data: JSON.stringify(eventDetail),
    });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");
    ws.connection?.onmessage?.(messageEvent);

    expect(dispatchEventSpy).toHaveBeenCalled();
    const customEvent = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
    expect(customEvent.detail.eventName).toBe(eventDetail.event_name);
    expect(customEvent.detail.result).toBe(eventDetail.result);
    expect(customEvent.detail.request).toEqual(eventDetail.request);
  });
});
