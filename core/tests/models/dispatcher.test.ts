import { describe, beforeEach, afterEach, it, expect, vitest, vi } from "vitest";
import type { WSMessage } from "@/core/models/dispatcher";

vi.doUnmock("@/core/models/dispatcher");

const { Dispatcher, DispatcherEvent, Request, maxLogs } = await import("@/core/models/dispatcher");

describe("DispatcherEvent", () => {
  beforeEach(() => {
    // Mock window.dispatchEvent
    window.dispatchEvent = vitest.fn();
  });

  it("should create a dispatcher event with correct properties", () => {
    const createdAt = Date.now();
    const event = new DispatcherEvent("fetch", createdAt, "test-event");

    expect(event.type).toBe("fetch");
    expect(event.createdAt).toBe(createdAt);
    expect(event.name).toBe("test-event");
    expect(event.finishedAt).toBeDefined();
    expect(event.duration).toBeDefined();
  });

  it("should dispatch custom event for ws type", () => {
    const message: WSMessage<unknown> = {
      eventName: "test-ws-event",
      eventType: "test",
    };
    new DispatcherEvent("ws", Date.now(), "test-event", message);

    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
  });

  it("should not dispatch custom event for fetch type without message", () => {
    new DispatcherEvent("fetch", Date.now(), "test-event");
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });
});

describe("Request", () => {
  beforeEach(() => {
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  it("should create a request with correct initial properties", () => {
    const request = new Request("/test", { debugMode: false });
    expect(request.endpoint).toBe("/test");
    expect(request.createdAt).toBeDefined();
    expect(request.events).toBeUndefined();
    expect(request.finishedAt).toBeUndefined();
  });

  it("should add events correctly", () => {
    const request = new Request("/test", { debugMode: false });
    request.addEvent("fetch", "test-event");

    expect(request.events?.length).toBe(1);
    expect(request.events?.[0].name).toBe("test-event");
  });

  it("should handle timeout events", () => {
    const request = new Request("/test", {
      debugMode: false,
      timeoutEventName: "timeout",
      finalEventName: "final",
    });
    request.addEvent("fetch", "test-event");

    vitest.advanceTimersByTime(40000); // Default timeout

    expect(request.events?.length).toBe(3);
    expect(request.events?.[1].name).toBe("timeout");
  });

  it("should handle expected events count", () => {
    const request = new Request("/test", {
      debugMode: false,
      expectedEvents: 2,
      finalEventName: "final",
    });

    request.addEvent("ws", "event1");
    request.addEvent("ws", "event2");

    expect(request.events?.length).toBe(3); // 2 events + final event
    expect(request.events?.[2].name).toBe("final");
  });

  it("should not add events after request is finished", () => {
    const request = new Request("/test", {
      debugMode: false,
      finalEventName: "final",
    });

    request.addEvent("ws", "final");
    request.addEvent("ws", "another-event");

    expect(request.events?.length).toBe(1);
  });

  it("should log if debugMode is true", () => {
    const spy = vi.spyOn(console, "groupCollapsed");

    const request = new Request("/test", { debugMode: true });
    request.addEvent("fetch", "test-event");

    expect(spy).toHaveBeenCalled();
  });

  it("addFinalEvent without finalEventName should not add any event", () => {
    const request = new Request("/test", { debugMode: true });
    request.addFinalEvent();

    expect(request.events).toBeUndefined();
  });
});

describe("Dispatcher", () => {
  it("should create dispatcher with correct initial state", () => {
    const dispatcher = new Dispatcher();
    expect(dispatcher.requests).toEqual([]);
    expect(dispatcher.debugMode).toBe(false);
  });

  it("should add requests correctly", () => {
    const dispatcher = new Dispatcher();
    const request = dispatcher.add("/test");

    expect(dispatcher.requests.length).toBe(1);
    expect(dispatcher.requests[0]).toBe(request);
  });

  it("should respect maxLogs limit", () => {
    const dispatcher = new Dispatcher();

    // Add more than maxLogs requests
    for (let i = 0; i < maxLogs + 10; i++) {
      dispatcher.add(`/test-${i}`);
    }

    expect(dispatcher.requests.length).toBe(maxLogs);
    expect(dispatcher.requests[0].endpoint).toBe(`/test-${10}`); // First 10 should be removed
  });

  it("should find request by id", () => {
    const dispatcher = new Dispatcher();
    const request = dispatcher.add("/test");
    request.id = "test-id";

    expect(dispatcher.getById("test-id")).toBe(request);
    expect(dispatcher.getById("non-existent")).toBeUndefined();
  });
});
