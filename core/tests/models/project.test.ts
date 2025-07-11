import { surfacesFactory } from "@/core/factories/surface";
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
    expect(projectRestyleTimeoutDelay(surfacesFactory(1))).toBe(10000);
    expect(projectRestyleTimeoutDelay(surfacesFactory(50))).toBe(10000);
    expect(projectRestyleTimeoutDelay(surfacesFactory(51))).toBe(20000);
  });
  test("projectResizeTimeoutDelay", async () => {
    expect(projectResizeTimeoutDelay(surfacesFactory(1))).toBe(10000);
    expect(projectResizeTimeoutDelay(surfacesFactory(50))).toBe(10000);
    expect(projectResizeTimeoutDelay(surfacesFactory(51))).toBe(20000);
  });
});
