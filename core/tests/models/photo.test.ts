import { photoAnalyzeTimeoutDelay, photoDeprecationCheck } from "@/core/models/photo";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { addEventMock, finishMock } from "@/core/tests/mocks/dispatcher";
import { photoFactory } from "@/core/factories/photo";
import type { DispatcherEvent } from "@/core/models/dispatcher";

describe("Photo", () => {
  test("photoAnalyzeTimeoutDelay", async () => {
    expect(photoAnalyzeTimeoutDelay(1)).toBe(15000);
    expect(photoAnalyzeTimeoutDelay(100)).toBe(15000);
    expect(photoAnalyzeTimeoutDelay(101)).toBe(20000);
    expect(photoAnalyzeTimeoutDelay(400)).toBe(20000);
    expect(photoAnalyzeTimeoutDelay(401)).toBe(25000);
    expect(photoAnalyzeTimeoutDelay(800)).toBe(25000);
    expect(photoAnalyzeTimeoutDelay(801)).toBe(45000);
  });
});

describe("photoDeprecationWarningThreshold", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    addEventMock.mockClear();
    finishMock.mockClear();
  });

  test("photoDeprecationCheck without analyzed photos", async () => {
    const events: DispatcherEvent[] = [];

    const addEvent = vi.fn();

    photoDeprecationCheck(events, addEvent, "requestId");
    expect(addEvent).not.toHaveBeenCalled();
  });

  test("photoDeprecationCheck with analyzed photos that are all selected", async () => {
    const events: DispatcherEvent[] = Array.from(
      { length: 10 },
      () =>
        ({
          type: "ws",
          name: "photo.analyzed",
          message: {
            eventName: "photo.analyzed",
            result: photoFactory({ selected: true }),
          },
        }) as DispatcherEvent,
    );

    const addEvent = vi.fn();

    photoDeprecationCheck(events, addEvent, "requestId");
    expect(addEvent).not.toHaveBeenCalled();
  });

  test("photoDeprecationCheck with analyzed photos that are not selected", async () => {
    const events: DispatcherEvent[] = Array.from(
      { length: 10 },
      () =>
        ({
          type: "ws",
          name: "photo.analyzed",
          message: {
            result: photoFactory({ selected: false }),
          },
        }) as DispatcherEvent,
    );

    const addEvent = vi.fn();

    photoDeprecationCheck(events, addEvent, "requestId");
    expect(addEvent).toHaveBeenCalled();
  });
});
