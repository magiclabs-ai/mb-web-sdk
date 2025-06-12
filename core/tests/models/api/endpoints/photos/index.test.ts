import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { photoAnalyzeBodyFactory } from "@/core/factories/photo";
import { analyzedPhotoSchema } from "@/core/models/photo";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import type { MBEvent } from "@/core/models/event";
import { addEventMock, finishMock } from "@/core/tests/mocks/dispatcher";

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

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
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

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("photo.analyze");
    expect(analyzedPhotoSchema.parse(event.result)).toStrictEqual(event.result);
  });
});
