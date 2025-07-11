import { surfacesFactory } from "@/core/factories/surface";
import {
  projectAutofillTimeoutDelay,
  projectRestyleTimeoutDelay,
  projectResizeTimeoutDelay,
} from "@/core/models/project";
import { describe, expect, test } from "vitest";

describe("Project", () => {
  test("projectAutofillTimeoutDelay", async () => {
    expect(projectAutofillTimeoutDelay(1)).toBe(15000);
    expect(projectAutofillTimeoutDelay(40)).toBe(15000);
    expect(projectAutofillTimeoutDelay(41)).toBe(20000);
    expect(projectAutofillTimeoutDelay(80)).toBe(20000);
    expect(projectAutofillTimeoutDelay(81)).toBe(25000);
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
