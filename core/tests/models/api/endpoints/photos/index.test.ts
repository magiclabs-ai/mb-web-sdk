import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { photoFactory } from "@/core/factories/photo";
import { analyzedPhotoSchema } from "@/core/models/photo";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import type { MBEvent } from "@/core/models/event";

describe("Photo", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  // The schema parse but in the future we should check that response id is a number
  test("analyze with useIntAsPhotoId", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
      useIntAsPhotoId: true,
    });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.photos.analyze([photoFactory(true)]);
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("photo.analyze");
    expect(analyzedPhotoSchema.parse(event.result)).toStrictEqual(event.result);
  });

  test("analyze without useIntAsPhotoId", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.photos.analyze([photoFactory()]);
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("photo.analyze");
    expect(analyzedPhotoSchema.parse(event.result)).toStrictEqual(event.result);
  });
});
