import { maxLogs } from "@/core/models/logger";
import { describe, expect, test, vi } from "vitest";

vi.doUnmock("@/core/models/logger");

const { Logger } = await import("@/core/models/logger");
const logger = new Logger();

describe("Logger", () => {
  test("Add and retrieve", () => {
    const logId = "123";
    const log = logger.add("test");
    log.id = logId;
    expect(logger.getById(logId)).toBe(log);
  });

  test("If max size is reached, the oldest log is removed", () => {
    for (let i = 0; i < maxLogs + 1; i++) {
      logger.add(`test ${i}`);
    }

    // @ts-ignore
    expect(logger.logs.length).toBe(maxLogs);
  });

  test("Add 1 sub process", () => {
    const log = logger.add("test");
    const subProcess = log.addSubProcess("fetch", "test");
    expect(subProcess.name).toBe("test");
    expect(subProcess.type).toBe("fetch");
  });

  test("Add 2 sub processes", () => {
    const log = logger.add("endpoint");
    log.addSubProcess("fetch", "endpoint");
    log.addSubProcess("ws", "event.name");

    expect(log.subProcesses?.length).toBe(2);
    expect(log.subProcesses?.[0].name).toBe("endpoint");
    expect(log.subProcesses?.[1].name).toBe("event.name");
  });

  test("Finish log", () => {
    const log = logger.add("endpoint");
    log.addSubProcess("fetch", "endpoint");
    log.addSubProcess("ws", "event.name");
    log.finish();

    expect(log.finishedAt).toBeDefined();
    expect(log.subProcesses?.[0].finishedAt).toBeDefined();
    expect(log.subProcesses?.[1].finishedAt).toBeDefined();
  });
});
