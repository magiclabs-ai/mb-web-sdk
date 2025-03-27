import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { surfaceSchema } from "@/core/models/surface";
import type { MBEvent } from "@/core/models/event";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { projectFactory } from "@/core/factories/project";
import { optionsFactory } from "@/core/factories/options";
import { addEventMock, finishMock } from "@/core/tests/mocks/dispatcher";

describe("Project with debug mode", () => {
  const project = projectFactory();
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
    debugMode: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("autofillOptions", async () => {
    const autofillOptions = optionsFactory();
    const imageCount = 20;

    const res = await api.projects.autofillOptions(imageCount);
    expect(addEventMock).toHaveBeenCalled();

    expect(res).toStrictEqual(autofillOptions);
  });

  test("autofill", async () => {
    const projectWithoutSurfaces = projectFactory({ noSurfaces: true });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.autofill(projectWithoutSurfaces);
    expect(addEventMock).toHaveBeenCalled();

    vi.runAllTimers();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<Record<string, unknown>>>).detail;
      expect(surfaceEvent.eventName).toBe("surfaces.designed");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });

  test("restyle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.restyle(project);
    expect(addEventMock).toHaveBeenCalled();

    vi.runAllTimers();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<Record<string, unknown>>>).detail;
      expect(surfaceEvent.eventName).toBe("surfaces.designed");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });

  test("resize", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.resize(project);
    expect(addEventMock).toHaveBeenCalled();

    vi.advanceTimersToNextTimer();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<Record<string, unknown>>>).detail;
      expect(surfaceEvent.eventName).toBe("surfaces.designed");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });
});

describe("Project without debug mode", () => {
  const project = projectFactory();
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    addEventMock.mockClear();
    finishMock.mockClear();
  });

  test("autofillOptions", async () => {
    const autofillOptions = optionsFactory();
    const imageCount = 20;

    const res = await api.projects.autofillOptions(imageCount);

    expect(res).toStrictEqual(autofillOptions);
  });

  test("autofill", async () => {
    const projectWithoutSurfaces = projectFactory({ noSurfaces: true });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.autofill(projectWithoutSurfaces);

    vi.runAllTimers();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<Record<string, unknown>>>).detail;
      expect(surfaceEvent.eventName).toBe("surfaces.designed");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });

  test("restyle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.restyle(project);

    vi.runAllTimers();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<Record<string, unknown>>>).detail;
      expect(surfaceEvent.eventName).toBe("surfaces.designed");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });

  test("resize", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.resize(project);

    vi.advanceTimersToNextTimer();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<Record<string, unknown>>>).detail;
      expect(surfaceEvent.eventName).toBe("surfaces.designed");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });
});
