import { beforeEach, describe, expect, test, vi } from "vitest";
import { WS } from "../../models/ws";
import { finishMock } from "../mocks/logger";
import { Logger } from "@/core/models/logger";

describe("WS", () => {
  let ws: WS;
  const url = "ws://localhost:8080";
  const logger = new Logger();

  beforeEach(() => {
    ws = new WS(url, () => {}, false, logger);
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

  test("should dispatch a custom event on message with useIntAsPhotoId", () => {
    const wsWithIntAsPhotoId = new WS(url, () => {}, true);
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
    wsWithIntAsPhotoId.connection?.onmessage?.(messageEvent);

    expect(dispatchEventSpy).toHaveBeenCalled();
    const customEvent = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
    expect(customEvent.detail.eventName).toBe(eventDetail.event_name);
    expect(customEvent.detail.result).toBe(eventDetail.result);
    expect(customEvent.detail.request).toEqual(eventDetail.request);
  });

  test("should trigger a log finish if the event is correct", () => {
    const eventDetail = {
      event_name: "photos.analyzed",
      result: "test_result",
    };
    const messageEvent = new MessageEvent("message", {
      data: JSON.stringify(eventDetail),
    });
    ws.connection?.onmessage?.(messageEvent);
    expect(finishMock).toHaveBeenCalled();
  });
});
