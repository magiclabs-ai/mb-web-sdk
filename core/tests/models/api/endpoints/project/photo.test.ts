import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { projectSchema } from "@/core/models/project";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { z } from "zod";

describe("Project Photo", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  test("resize", async () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const res = await api.project.photo.resize({
      metadata: [],
      photos: [],
    });
    expect(res).toStrictEqual({});

    vi.advanceTimersToNextTimer();

    const event = dispatchEventSpy.mock.calls[0][0]["detail"];
    expect(event.eventName).toBe("project.photo.resize");
    expect(projectSchema.parse(event.payload)).toStrictEqual(event.payload);
  });
});
