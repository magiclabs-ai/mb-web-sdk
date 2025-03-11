import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { surfaceSchema } from "@/core/models/surface";
import type { MBEvent } from "@/core/models/event";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { projectFactory } from "@/core/factories/project";
import { optionsFactory } from "@/core/factories/options";
import { addSubProcessMock, finishMock } from "@/core/tests/mocks/logger";

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
    expect(addSubProcessMock).toHaveBeenCalled();

    expect(res).toStrictEqual(autofillOptions);
  });

  test("autofill", async () => {
    const projectWithoutSurfaces = projectFactory({ noSurfaces: true });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.autofill(projectWithoutSurfaces);
    expect(addSubProcessMock).toHaveBeenCalled();

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
    expect(addSubProcessMock).toHaveBeenCalled();

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
    expect(addSubProcessMock).toHaveBeenCalled();

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
    addSubProcessMock.mockClear();
    finishMock.mockClear();
  });

  test("autofillOptions", async () => {
    const autofillOptions = optionsFactory();
    const imageCount = 20;

    const res = await api.projects.autofillOptions(imageCount);
    expect(addSubProcessMock).not.toHaveBeenCalled();

    expect(res).toStrictEqual(autofillOptions);
  });

  test("autofill", async () => {
    const projectWithoutSurfaces = projectFactory({ noSurfaces: true });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.projects.autofill(projectWithoutSurfaces);
    expect(addSubProcessMock).not.toHaveBeenCalled();

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
    expect(addSubProcessMock).not.toHaveBeenCalled();

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
    expect(addSubProcessMock).not.toHaveBeenCalled();

    vi.advanceTimersToNextTimer();

    for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
      const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<Record<string, unknown>>>).detail;
      expect(surfaceEvent.eventName).toBe("surfaces.designed");
      expect(surfaceSchema.parse(surfaceEvent.result[0])).toStrictEqual(surfaceEvent.result[0]);
    }
  });
});
