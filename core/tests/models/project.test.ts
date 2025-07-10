import {
  projectAutofillTimeoutDelay,
  projectRestyleTimeoutDelay,
  projectResizeTimeoutDelay,
} from "@/core/models/project";
import { describe, expect, test } from "vitest";

describe("Project", () => {
  test("projectAutofillTimeoutDelay", async () => {
    expect(projectAutofillTimeoutDelay(1)).toBe(10000);
    expect(projectAutofillTimeoutDelay(100)).toBe(10000);
    expect(projectAutofillTimeoutDelay(101)).toBe(15000);
    expect(projectAutofillTimeoutDelay(400)).toBe(15000);
    expect(projectAutofillTimeoutDelay(401)).toBe(20000);
    expect(projectAutofillTimeoutDelay(800)).toBe(20000);
    expect(projectAutofillTimeoutDelay(801)).toBe(30000);
  });
  test("projectRestyleTimeoutDelay", async () => {
    expect(projectRestyleTimeoutDelay(1)).toBe(10000);
    expect(projectRestyleTimeoutDelay(50)).toBe(10000);
    expect(projectRestyleTimeoutDelay(51)).toBe(20000);
  });
  test("projectResizeTimeoutDelay", async () => {
    expect(projectResizeTimeoutDelay(1)).toBe(10000);
    expect(projectResizeTimeoutDelay(50)).toBe(10000);
    expect(projectResizeTimeoutDelay(51)).toBe(20000);
  });
});
