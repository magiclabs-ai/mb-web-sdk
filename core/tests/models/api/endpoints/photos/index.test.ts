import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { photoAnalyzeBodyFactory, photoFactory } from "@/core/factories/photo";
import { analyzedPhotoSchema } from "@/core/models/photo";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import type { DispatcherEvent, WSMessage } from "@/core/models/dispatcher";
import { addEventMock, finishMock } from "@/core/tests/mocks/dispatcher";
import { photoDeprecationCheck } from "@/core/models/api/endpoints/photos";

describe("Photo", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("analyze", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
      debugMode: true,
    });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.photos.analyze(photoAnalyzeBodyFactory());
    expect(addEventMock).toHaveBeenCalled();
    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<WSMessage<unknown>>).detail;
    expect(event.eventName).toBe("photo.analyze");
    expect(analyzedPhotoSchema.parse(event.result)).toStrictEqual(event.result);
  });
});

describe("Photo without debug mode", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    addEventMock.mockClear();
    finishMock.mockClear();
  });

  test("analyze", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.photos.analyze(photoAnalyzeBodyFactory());
    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<WSMessage<unknown>>).detail;
    expect(event.eventName).toBe("photo.analyze");
    expect(analyzedPhotoSchema.parse(event.result)).toStrictEqual(event.result);
  });
});

describe("Photo with photoDeprecationWarningThreshold", () => {
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
