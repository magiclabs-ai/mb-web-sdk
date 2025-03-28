import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { surfaceSchema } from "@/core/models/surface";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { z } from "zod";
import type { MBEvent } from "@/core/models/event";
import { addEventMock, finishMock } from "@/core/tests/mocks/dispatcher";
import { projectFactory } from "@/core/factories/project";

const project = projectFactory();

describe("Surface", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
    debugMode: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("shuffle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.surfaces.shuffle(project);
    expect(addEventMock).toHaveBeenCalled();

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("surfaces.designed");
    expect(surfaceSchema.parse(event.result)).toStrictEqual(event.result);
  });

  test("autoAdapt", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.surfaces.autoAdapt(project);
    expect(addEventMock).toHaveBeenCalled();

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("surfaces.designed");
    expect(surfaceSchema.parse(event.result)).toStrictEqual(event.result);
  });

  test("suggest", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.surfaces.suggest(project);
    expect(addEventMock).toHaveBeenCalled();

    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("surfaces.designed");
    expect(z.array(surfaceSchema).parse(event.result)).toStrictEqual(event.result);
  });
});

describe("Surface without debug mode", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    addEventMock.mockClear();
    finishMock.mockClear();
  });

  test("shuffle", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.surfaces.shuffle(project);
    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("surfaces.designed");
    expect(surfaceSchema.parse(event.result)).toStrictEqual(event.result);
  });

  test("autoAdapt", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.surfaces.autoAdapt(project);
    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("surfaces.designed");
    expect(surfaceSchema.parse(event.result)).toStrictEqual(event.result);
  });

  test("suggest", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await api.surfaces.suggest(project);
    vi.advanceTimersToNextTimer();

    const event = (dispatchEventSpy.mock.calls[0][0] as CustomEvent<MBEvent<unknown>>).detail;
    expect(event.eventName).toBe("surfaces.designed");
    expect(z.array(surfaceSchema).parse(event.result)).toStrictEqual(event.result);
  });
});
