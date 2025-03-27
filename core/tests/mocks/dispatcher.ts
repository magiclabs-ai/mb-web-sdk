import { vi } from "vitest";

export const addEventMock = vi.fn().mockImplementation(() => {});

export const finishMock = vi.fn().mockImplementation(() => {});

vi.mock("@/core/models/dispatcher", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/core/models/dispatcher")>();

  const requestMocker = vi.fn().mockImplementation(() => ({
    addEvent: addEventMock,
    finish: finishMock,
  }));

  const dispatcherMocker = vi.fn().mockImplementation(() => ({
    add: requestMocker,
    getById: requestMocker,
  }));

  return {
    ...actual,
    Dispatcher: dispatcherMocker,
    Request: requestMocker,
  };
});
