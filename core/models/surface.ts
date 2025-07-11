import { metadataSchema } from "@/core/models/metadata";
import { z } from "zod/v4";

const photoContentSchema = z.object({
  contentType: z.string(),
  userData: z.object({
    assetId: z.string().or(z.number()),
    w: z.number(),
    h: z.number(),
    x: z.number(),
    y: z.number(),
    rot: z.number(),
    journalCore: z.string(),
  }),
});

const borderContentSchema = z.object({
  contentType: z.string(),
  userData: z.object({
    borderColor: z.string(),
    borderOverlap: z.number(),
    borderWidthPixels: z.number(),
  }),
});

const layeredItemSchema = z.object({
  container: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
    rot: z.number(),
  }),
  // type: z.enum(["photo"]),
  type: z.string(),
  content: photoContentSchema,
  border: borderContentSchema.optional(),
  layerMetadata: z.array(metadataSchema),
});

export const surfaceSchema = z.object({
  surfaceNumber: z.number(),
  surfaceData: z.object({
    pageDetails: z.object({
      width: z.number(),
      height: z.number(),
      dpi: z.number(),
    }),
    layeredItems: z.array(layeredItemSchema),
  }),
  surfaceMetadata: z.array(metadataSchema),
  version: z.string(),
});

export type Surface = z.infer<typeof surfaceSchema>;
export type LayeredItem = z.infer<typeof layeredItemSchema>;
export type PhotoContent = z.infer<typeof photoContentSchema>;
export type BorderContent = z.infer<typeof borderContentSchema>;

export function surfaceSuggestTimeoutDelay(surface: Surface) {
  if (isSpread(surface)) {
    return 8000; // 8 seconds
  }
  return 4000; // 4 seconds
}

export function surfaceShuffleTimeoutDelay(surface: Surface) {
  if (isSpread(surface)) {
    return 3000; // 3 seconds
  }
  return 2000; // 2 seconds
}

export function surfaceAutoAdaptTimeoutDelay(surface: Surface) {
  return surfaceShuffleTimeoutDelay(surface);
}

export function getSurfaceType(surface: Surface) {
  return surface.surfaceNumber === -2 || surface.surfaceNumber === -4 ? "cover" : "inside";
}

export function isSpread(surface: Surface) {
  return surface.surfaceMetadata.some((m) => m.name === "renderingSurfaceType" && m.value === "spread");
}
