import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { projectSchema } from "@/core/models/project";
import { surfaceSchema } from "@/core/models/surface";
import type { MBEvent } from "@/core/models/event";
import { vi } from "vitest";
import { beforeEach } from "vitest";

describe("Project", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("autofill", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.projects.autofill({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.runAllTimers();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("projects.autofill");
    expect(projectSchema.parse(event.result)).toStrictEqual(event.result);

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<unknown>>).detail;
      expect(surfaceEvent.eventName).toBe("projects.autofill.surface");
      expect(surfaceSchema.parse(surfaceEvent.result)).toStrictEqual(surfaceEvent.result);
    }
  });

  test("restyle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.projects.restyle({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.runAllTimers();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("projects.restyle");
    expect(projectSchema.parse(event.result)).toStrictEqual(event.result);

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<unknown>>).detail;
      expect(surfaceEvent.eventName).toBe("projects.restyle.surface");
      expect(surfaceSchema.parse(surfaceEvent.result)).toStrictEqual(surfaceEvent.result);
    }
  });

  test("resize", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.projects.resize({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("projects.resize");
    expect(projectSchema.parse(event.result)).toStrictEqual(event.result);

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<unknown>>).detail;
      expect(surfaceEvent.eventName).toBe("projects.resize.surface");
      expect(surfaceSchema.parse(surfaceEvent.result)).toStrictEqual(surfaceEvent.result);
    }
  });
});
