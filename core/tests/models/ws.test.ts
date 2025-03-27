import { beforeEach, describe, expect, test, vi } from "vitest";
import { WS } from "../../models/ws";
import { addEventMock, finishMock } from "../mocks/dispatcher";
import { Dispatcher } from "../../models/dispatcher";

describe("WS", () => {
  let ws: WS;
  const url = "ws://localhost:8080";
  const dispatcher = new Dispatcher();

  beforeEach(() => {
    ws = new WS(url, () => {}, false, dispatcher);
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

  test("should add event in dispatcher request", () => {
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

    ws.connection?.onmessage?.(messageEvent);

    expect(addEventMock).toHaveBeenCalledWith("ws", eventDetail.event_name, {
      eventName: eventDetail.event_name,
      result: eventDetail.result,
      request: eventDetail.request,
    });
  });

  test("should add event in dispatcher request with useIntAsPhotoId", () => {
    const wsWithIntAsPhotoId = new WS(url, () => {}, true, dispatcher);
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

    wsWithIntAsPhotoId.connection?.onmessage?.(messageEvent);

    expect(addEventMock).toHaveBeenCalledWith("ws", eventDetail.event_name, {
      eventName: eventDetail.event_name,
      result: eventDetail.result,
      request: eventDetail.request,
    });
  });
});
