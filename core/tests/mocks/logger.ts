import { vi } from "vitest";

export const addSubProcessMock = vi.fn().mockImplementation(() => {});

export const finishMock = vi.fn().mockImplementation(() => {});

vi.mock("@/core/models/logger", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/core/models/logger")>();

  const logMocker = vi.fn().mockImplementation(() => ({
    addSubProcess: addSubProcessMock,
    finish: finishMock,
  }));

  const loggerMocker = vi.fn().mockImplementation(() => ({
    add: logMocker,
    getById: logMocker,
  }));

  return {
    ...actual,
    Log: logMocker,
    Logger: loggerMocker,
  };
});
