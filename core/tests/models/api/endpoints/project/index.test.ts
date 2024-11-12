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

    // for (let i = 1; i < dispatchEventSpy.mock.calls.length; i++) {
    //   const surfaceEvent = (dispatchEventSpy.mock.calls[i][0] as CustomEvent<MBEvent<unknown>>).detail;
    //   expect(surfaceEvent.eventName).toBe("projects.autofill.surface");
    //   expect(surfaceSchema.parse(surfaceEvent.result)).toStrictEqual(surfaceEvent.result);
    // }
  });
});
