import { surfacesFactory } from "@/core/factories/surface";
import {
  projectAutofillTimeoutDelay,
  projectRestyleTimeoutDelay,
  projectResizeTimeoutDelay,
} from "@/core/models/project";
import { describe, expect, test } from "vitest";

describe("Project", () => {
  test("projectAutofillTimeoutDelay", async () => {
    // @ts-expect-error - undefined is not a number
    expect(projectAutofillTimeoutDelay(undefined)).toBe(40000);
    expect(projectAutofillTimeoutDelay(1)).toBe(30000);
    expect(projectAutofillTimeoutDelay(40)).toBe(30000);
    expect(projectAutofillTimeoutDelay(41)).toBe(35000);
    expect(projectAutofillTimeoutDelay(80)).toBe(35000);
    expect(projectAutofillTimeoutDelay(81)).toBe(40000);
  });
  test("projectRestyleTimeoutDelay", async () => {
    expect(projectRestyleTimeoutDelay(surfacesFactory(1))).toBe(20000);
    expect(projectRestyleTimeoutDelay(surfacesFactory(50))).toBe(20000);
    expect(projectRestyleTimeoutDelay(surfacesFactory(51))).toBe(30000);
  });
  test("projectResizeTimeoutDelay", async () => {
    expect(projectResizeTimeoutDelay(surfacesFactory(1))).toBe(20000);
    expect(projectResizeTimeoutDelay(surfacesFactory(50))).toBe(20000);
    expect(projectResizeTimeoutDelay(surfacesFactory(51))).toBe(30000);
  });
});
