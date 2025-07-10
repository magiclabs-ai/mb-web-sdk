import {
  surfaceShuffleTimeoutDelay,
  surfaceAutoAdaptTimeoutDelay,
  surfaceSuggestTimeoutDelay,
} from "@/core/models/surface";
import { describe, expect, test } from "vitest";

describe("Surface", () => {
  test("surfaceShuffleTimeoutDelay", async () => {
    expect(surfaceShuffleTimeoutDelay("photo")).toBe(2000);
    expect(surfaceShuffleTimeoutDelay("cover")).toBe(3000);
  });
  test("surfaceAutoAdaptTimeoutDelay", async () => {
    expect(surfaceAutoAdaptTimeoutDelay("photo")).toBe(2000);
    expect(surfaceAutoAdaptTimeoutDelay("cover")).toBe(3000);
  });
  test("surfaceSuggestTimeoutDelay", async () => {
    expect(surfaceSuggestTimeoutDelay("photo")).toBe(4000);
    expect(surfaceSuggestTimeoutDelay("cover")).toBe(8000);
  });
});
