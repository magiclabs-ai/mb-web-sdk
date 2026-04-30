import { beforeEach, describe, expect, test, vi } from "vitest";
import { WS } from "../../models/ws";
import { addEventMock } from "../mocks/dispatcher";
import { Dispatcher } from "../../models/dispatcher";
import {
  maxReconnectionAttempts,
  wsForceCloseGracePeriod,
  wsHeartbeatInterval,
  wsPongTimeout,
  wsTtlRefreshInterval,
} from "../../config";

describe("WS", () => {
  let ws: WS;
  const url = "ws://localhost:8080";
  const dispatcher = new Dispatcher();

  beforeEach(() => {
    ws = new WS(url, () => {}, dispatcher);
  });

  test("should initialize with the correct URL", () => {
    expect(ws).toBeInstanceOf(WS);
  });

  test("should establish a WebSocket connection", () => {
    expect(ws.isConnectionOpen()).toBe(false);
    ws.connection = { readyState: 1 } as WebSocket;
    expect(ws.isConnectionOpen()).toBe(true);
  });

  test("should return false if connection is connecting", async () => {
    ws.connection = { readyState: 0 } as WebSocket;
    const res = await ws.connect();
    expect(res).toBe(false);
  });

  test("should return true if connection is already open", async () => {
    ws.connection = { readyState: 1 } as WebSocket;
    const res = await ws.connect();
    expect(res).toBe(true);
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
  test("should send a single ping per heartbeat interval and only schedule the next one after pong arrives", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: mock access
    const connection = ws.connection as any;
    connection.readyState = WebSocket.OPEN;
    connection.onopen?.();

    // First interval: one ping is sent.
    vi.advanceTimersByTime(wsHeartbeatInterval);
    expect(connection.send).toHaveBeenCalledWith(JSON.stringify({ action: "ping" }));
    expect(connection.send).toHaveBeenCalledTimes(1);

    // Without a pong, no further pings are scheduled before the pong timeout would fire.
    vi.advanceTimersByTime(wsPongTimeout - 1);
    expect(connection.send).toHaveBeenCalledTimes(1);

    // Pong arrives -> next ping is scheduled, fires after another heartbeat interval.
    connection.onmessage?.(new MessageEvent("message", { data: JSON.stringify({ result: "pong" }) }));
    vi.advanceTimersByTime(wsHeartbeatInterval);
    expect(connection.send).toHaveBeenCalledTimes(2);
  });

  test("should close the connection if pong is not received within the timeout", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: mock access
    const connection = ws.connection as any;
    connection.readyState = WebSocket.OPEN;
    connection.onopen?.();

    vi.advanceTimersByTime(wsHeartbeatInterval);
    expect(connection.send).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(wsPongTimeout);
    expect(connection.close).toHaveBeenCalledTimes(1);
  });

  test("should fire onclose even if the underlying socket never emits close after a pong timeout", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: mock access
    const connection = ws.connection as any;
    connection.stallClose = true;
    connection.readyState = WebSocket.OPEN;
    connection.onopen?.();
    const oncloseSpy = vi.fn();
    const originalOnclose = connection.onclose;
    connection.onclose = (event: CloseEvent) => {
      oncloseSpy();
      originalOnclose?.(event);
    };

    vi.advanceTimersByTime(wsHeartbeatInterval + wsPongTimeout + wsForceCloseGracePeriod);

    expect(connection.close).toHaveBeenCalledTimes(1);
    expect(oncloseSpy).toHaveBeenCalledTimes(1);
  });

  test("should not double-fire onclose if the socket eventually emits close after the force-close path runs", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: mock access
    const connection = ws.connection as any;
    connection.stallClose = true;
    connection.readyState = WebSocket.OPEN;
    connection.onopen?.();
    const oncloseSpy = vi.fn();
    const originalOnclose = connection.onclose;
    connection.onclose = (event: CloseEvent) => {
      oncloseSpy();
      originalOnclose?.(event);
    };

    vi.advanceTimersByTime(wsHeartbeatInterval + wsPongTimeout + wsForceCloseGracePeriod);
    expect(oncloseSpy).toHaveBeenCalledTimes(1);

    // The browser belatedly fires onclose. It should be a no-op because we detached it.
    connection.onclose?.(new CloseEvent("close"));
    expect(oncloseSpy).toHaveBeenCalledTimes(1);
  });

  test("should ignore pong frames (not dispatch them)", () => {
    addEventMock.mockClear();
    const messageEvent = new MessageEvent("message", {
      data: JSON.stringify({ result: "pong" }),
    });

    ws.connection?.onmessage?.(messageEvent);

    expect(addEventMock).not.toHaveBeenCalled();
  });

  test("should stop heartbeat on close", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: mock access
    const connection = ws.connection as any;
    connection.readyState = WebSocket.OPEN;
    connection.onopen?.();
    vi.advanceTimersByTime(wsHeartbeatInterval);
    const callsBeforeClose = connection.send.mock.calls.length;

    ws.connection?.onclose?.(new CloseEvent("close"));
    vi.advanceTimersByTime(wsHeartbeatInterval * 3);

    expect(connection.send.mock.calls.length).toBe(callsBeforeClose);
  });

  test("should close connection after ttl refresh interval to rotate it", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: mock access
    const connection = ws.connection as any;
    connection.readyState = WebSocket.OPEN;
    connection.onopen?.();
    const closeSpy = vi.spyOn(connection, "close");

    vi.advanceTimersByTime(wsTtlRefreshInterval);

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  test("should reset reconnection attempts on successful open so ttl rotations don't drain the budget", () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: private access
    (ws as any).reconnectionAttempts = 5;
    // biome-ignore lint/suspicious/noExplicitAny: mock access
    const connection = ws.connection as any;
    connection.readyState = WebSocket.OPEN;
    connection.onopen?.();

    // biome-ignore lint/suspicious/noExplicitAny: private access
    expect((ws as any).reconnectionAttempts).toBe(0);
  });

  test("manual connect does not schedule auto-retries on failure", async () => {
    vi.useFakeTimers();
    // biome-ignore lint/suspicious/noExplicitAny: private access
    const connectSpy = vi.spyOn(ws as any, "connect");
    connectSpy.mockClear();

    const result = ws.connect({ manual: true });
    // Fail the manual attempt before it opens.
    ws.connection?.onclose?.(new CloseEvent("close"));
    vi.advanceTimersByTime(60_000);

    await expect(result).resolves.toBe(false);
    expect(connectSpy).toHaveBeenCalledTimes(1);
    expect(ws.hasReachedMaxReconnectionAttempts()).toBe(true);
  });

  test("should return false if max reconnection attempts is reached", () => {
    vi.useFakeTimers();
    vi.advanceTimersToNextTimer();

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const connectSpy = vi.spyOn(ws as any, "connect");

    for (let i = 0; i <= maxReconnectionAttempts + 1; i++) {
      if (i !== maxReconnectionAttempts) {
        ws?.connection?.close();
      }
      vi.advanceTimersToNextTimer();
      vi.advanceTimersToNextTimer();
    }
    expect(connectSpy).toHaveBeenCalledTimes(maxReconnectionAttempts);
    expect(connectSpy.mock.results[connectSpy.mock.results.length - 1].value).resolves.toBe(false);
  });
});
