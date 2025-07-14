import { surfaceFactory } from "@/core/factories/surface";
import {
  surfaceShuffleTimeoutDelay,
  surfaceAutoAdaptTimeoutDelay,
  surfaceSuggestTimeoutDelay,
  isSpread,
  getSurfaceType,
} from "@/core/models/surface";
import { describe, expect, test } from "vitest";

describe("Surface", () => {
  const SinglePageSurface = surfaceFactory();
  const SpreadPageSurface = surfaceFactory({
    surfaceMetadata: [{ name: "renderingSurfaceType", value: "spread", metadataType: "string" }],
  });

  test("surfaceShuffleTimeoutDelay", async () => {
    expect(surfaceShuffleTimeoutDelay(SinglePageSurface)).toBe(15000);
    expect(surfaceShuffleTimeoutDelay(SpreadPageSurface)).toBe(18000);
  });
  test("surfaceAutoAdaptTimeoutDelay", async () => {
    expect(surfaceAutoAdaptTimeoutDelay(SinglePageSurface)).toBe(15000);
    expect(surfaceAutoAdaptTimeoutDelay(SpreadPageSurface)).toBe(18000);
  });
  test("surfaceSuggestTimeoutDelay", async () => {
    expect(surfaceSuggestTimeoutDelay(SinglePageSurface)).toBe(16000);
    expect(surfaceSuggestTimeoutDelay(SpreadPageSurface)).toBe(22000);
  });
  test("isSpread", async () => {
    expect(isSpread(SinglePageSurface)).toBe(false);
    expect(isSpread(SpreadPageSurface)).toBe(true);
  });
  test("getSurfaceType", async () => {
    const insideSurface = surfaceFactory({ surfaceNumber: 1 });
    const coverSurface = surfaceFactory({ surfaceNumber: -2 });
    expect(getSurfaceType(insideSurface)).toBe("inside");
    expect(getSurfaceType(coverSurface)).toBe("cover");
  });
});
