import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { surfaceSchema } from "@/core/models/surface";
import type { MBEvent } from "@/core/models/event";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { projectFactory } from "@/core/factories/project";
import { makeMyBookFactory } from "@/core/factories/mmb";

describe("Project", () => {
  const project = projectFactory();
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("autofill", async () => {
    const projectWithoutSurfaces = projectFactory({ noSurfaces: true });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.projects.autofill(projectWithoutSurfaces);
    expect(res).toStrictEqual({});

    vi.runAllTimers();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<unknown>>).detail;
      expect(surfaceEvent.eventName).toBe("project.edited");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });

  test("makeMyBook", async () => {
    const projectWithoutSurfaces = makeMyBookFactory();

    const res = await api.projects.makeMyBook(projectWithoutSurfaces);
    expect(res).toStrictEqual({});
  });

  test("restyle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.projects.restyle(project);
    expect(res).toStrictEqual({});

    vi.runAllTimers();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<unknown>>).detail;
      expect(surfaceEvent.eventName).toBe("project.edited");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });

  test("resize", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.projects.resize(project);
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<unknown>>).detail;
      expect(surfaceEvent.eventName).toBe("project.edited");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });
});
