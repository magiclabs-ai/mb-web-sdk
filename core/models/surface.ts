import { metadataSchema } from "@/core/models/metadata";
import { z } from "zod/v4";

const photoContentSchema = z.object({
  contentType: z.string(),
  userData: z.object({
    // Absent on an empty photo well, and on the background/embellishment layers of an
    // authored cover design. An empty string is accepted for the same reason.
    assetId: z.string().or(z.number()).optional(),
    w: z.number(),
    h: z.number(),
    x: z.number(),
    y: z.number(),
    rot: z.number(),
    journalCore: z.string().optional(),
  }),
});

const lineOfTextSchema = z.object({
  x: z.number(),
  y: z.number(),
  userLineFeed: z.boolean(),
  text: z.string(),
});

/**
 * A text layer's `userData` carries font and copy rather than the `w/h/x/y/rot` geometry every other
 * layer type uses — its placement comes from the layer's `container` instead.
 */
const textContentSchema = z.object({
  // Discriminates a text layer from the geometry-carrying layer types, whose `userData` shape differs.
  contentType: z.enum(["UserText", "PremiumUserText"]),
  textClass: z.string().optional(),
  userData: z.object({
    assetId: z.string().or(z.number()).optional(),
    fontSize: z.number().optional(),
    fontColor: z.string().optional(),
    alignmentAnchor: z.string().optional(),
    linesOfText: z.array(lineOfTextSchema).optional(),
    fullText: z.string().optional(),
    isCustomDesigned: z.boolean().optional(),
    userEditedText: z.boolean().optional(),
    lineSpacing: z.number().optional(),
    backgroundColor: z.string().optional(),
    backgroundOpacity: z.number().optional(),
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
  // Photo, background and embellishment layers share the geometry-carrying shape; text layers do not.
  content: z.union([photoContentSchema, textContentSchema]),
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

/**
 * A surface supplied on an autofill request: an authored cover design whose empty photo wells the API
 * fills. `surfaceType` and `layoutId` are request-only — the API does not echo them back, so they are
 * absent from `surfaceSchema` and from every response this SDK parses.
 */
export const autofillSurfaceSchema = surfaceSchema.extend({
  surfaceType: z.enum(["front", "back"]).optional(),
  layoutId: z.string().optional(),
});

export type Surface = z.infer<typeof surfaceSchema>;
export type AutofillSurface = z.infer<typeof autofillSurfaceSchema>;
export type LayeredItem = z.infer<typeof layeredItemSchema>;
export type PhotoContent = z.infer<typeof photoContentSchema>;
export type TextContent = z.infer<typeof textContentSchema>;
export type BorderContent = z.infer<typeof borderContentSchema>;

export function surfaceSuggestTimeoutDelay(surface: Surface) {
  if (isSpread(surface)) {
    return 22000; // 22 seconds
  }
  return 16000; // 16 seconds
}

export function surfaceShuffleTimeoutDelay(surface: Surface) {
  if (isSpread(surface)) {
    return 18000; // 18 seconds
  }
  return 15000; // 15 seconds
}

export function surfaceAutoAdaptTimeoutDelay(surface: Surface) {
  return surfaceShuffleTimeoutDelay(surface);
}

export const FRONT_COVER_SURFACE_NUMBER = -2;
export const BACK_COVER_SURFACE_NUMBER = -4;

export function getSurfaceType(surface: Surface) {
  return surface.surfaceNumber === FRONT_COVER_SURFACE_NUMBER || surface.surfaceNumber === BACK_COVER_SURFACE_NUMBER
    ? "cover"
    : "inside";
}

export function isSpread(surface: Surface) {
  return surface?.surfaceMetadata?.some((m) => m.name === "renderingSurfaceType" && m.value === "spread");
}
