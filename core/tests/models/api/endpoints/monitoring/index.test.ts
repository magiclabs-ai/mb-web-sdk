import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { addEventMock, finishMock } from "@/core/tests/mocks/dispatcher";
import { beforeEach } from "vitest";

describe("Monitoring", () => {
  beforeEach(() => {
    addEventMock.mockClear();
    finishMock.mockClear();
  });

  test("events", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });

    const res = await api.monitoring.events({
      eventName: "timeout",
      eventType: "timeout",
      requestId: "123",
      data: { timeoutDuration: 1000 },
    });
    expect(res).toStrictEqual(res);
  });

  test("events with error", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });

    await expect(
      api.monitoring.events({
        eventName: "timeout",
        eventType: "timeout",
        requestId: "123",
        data: { timeoutDuration: 1000 },
      }),
    ).rejects.toThrow();
  });
});
