import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { surfaceSchema } from "@/core/models/surface";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { z } from "zod";
import type { MBEvent } from "@/core/models/event";

describe("Surface", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("shuffle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.surfaces.shuffle({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("project.edited");
    expect(surfaceSchema.parse(event.result)).toStrictEqual(event.result);
  });

  test("autoAdapt", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.surfaces.autoAdapt({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("project.edited");
    expect(surfaceSchema.parse(event.result)).toStrictEqual(event.result);
  });

  test("suggest", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.surfaces.suggest({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("project.edited");
    expect(z.array(surfaceSchema).parse(event.result)).toStrictEqual(event.result);
  });
});
