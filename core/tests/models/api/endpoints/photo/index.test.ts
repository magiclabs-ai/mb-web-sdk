import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { photoFactory } from "@/core/factories/photo";
import { analyzedPhotoSchema } from "@/core/models/photo";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import type { MBEvent } from "@/core/models/event";

describe("Photo", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("analyze", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.photo.analyze([photoFactory()]);
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("photo.analyze");
    expect(analyzedPhotoSchema.parse(event.payload)).toStrictEqual(event.payload);
  });
});
