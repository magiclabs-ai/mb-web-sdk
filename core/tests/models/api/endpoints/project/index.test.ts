import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { projectSchema } from "@/core/models/project";
import { surfaceSchema } from "@/core/models/surface";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { z } from "zod";

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

    const res = await api.project.autofill({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.runAllTimers();

    const event = dispatchEventSpy.mock.calls[0][0]["detail"];
    expect(event.eventName).toBe("project.autofill");
    expect(projectSchema.parse(event.payload)).toStrictEqual(event.payload);

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = dispatchEventSpy.mock.calls[i][0]["detail"];
      expect(surfaceEvent.eventName).toBe("project.autofill.surface");
      expect(surfaceSchema.parse(surfaceEvent.payload)).toStrictEqual(surfaceEvent.payload);
    }
  });

  test("restyle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.project.restyle({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.runAllTimers();

    const event = dispatchEventSpy.mock.calls[0][0]["detail"];
    expect(event.eventName).toBe("project.restyle");
    expect(projectSchema.parse(event.payload)).toStrictEqual(event.payload);

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = dispatchEventSpy.mock.calls[i][0]["detail"];
      expect(surfaceEvent.eventName).toBe("project.restyle.surface");
      expect(surfaceSchema.parse(surfaceEvent.payload)).toStrictEqual(surfaceEvent.payload);
    }
  });
});
