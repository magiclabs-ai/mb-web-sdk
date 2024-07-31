import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { surfaceSchema } from "@/core/models/surface";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { z } from "zod";

describe("Surface", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("autofill", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.surface.autofill({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = dispatchEventSpy.mock.calls[0][0]["detail"];
    expect(event.eventName).toBe("surface.autofill");
    expect(surfaceSchema.parse(event.payload)).toStrictEqual(event.payload);
  });

  test("shuffle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.surface.shuffle({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = dispatchEventSpy.mock.calls[0][0]["detail"];
    expect(event.eventName).toBe("surface.shuffle");
    expect(surfaceSchema.parse(event.payload)).toStrictEqual(event.payload);
  });

  test("autoAdapt", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.surface.autoAdapt({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = dispatchEventSpy.mock.calls[0][0]["detail"];
    expect(event.eventName).toBe("surface.autoAdapt");
    expect(surfaceSchema.parse(event.payload)).toStrictEqual(event.payload);
  });

  test("suggest", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.surface.suggest({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = dispatchEventSpy.mock.calls[0][0]["detail"];
    expect(event.eventName).toBe("surface.suggest");
    expect(z.array(surfaceSchema).parse(event.payload)).toStrictEqual(event.payload);
  });
});
