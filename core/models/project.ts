import { analyzedPhotoSchema } from "@/core/models/photo";
import { type Surface, isSpread, surfaceSchema } from "@/core/models/surface";
import { z } from "zod/v4";

export const projectSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  designMode: z.string(),
  occasion: z.string(),
  style: z.string(),
  imageFilteringLevel: z.string(),
  imageDensityLevel: z.string(),
  embellishmentLevel: z.string(),
  bookFormat: z.object({
    pageType: z.string().optional(),
    skuPageRange: z.array(z.number()).optional(),
    startFromLeftSide: z.boolean().optional(),
    targetPageRange: z.array(z.number()),
    page: z.object({
      width: z.number(),
      height: z.number(),
    }),
    cover: z.object({
      width: z.number(),
      height: z.number(),
    }),
    coverWrap: z
      .object({
        top: z.number(),
        right: z.number(),
        bottom: z.number(),
        left: z.number(),
      })
      .optional(),
    bleed: z
      .object({
        top: z.number(),
        right: z.number(),
        bottom: z.number(),
        left: z.number(),
      })
      .optional(),
  }),
  images: z.array(analyzedPhotoSchema),
  surfaces: z.array(surfaceSchema),
});

export const projectAutofillBodySchema = projectSchema.omit({
  surfaces: true,
});

export type Project = z.infer<typeof projectSchema>;

export function projectAutofillTimeoutDelay(photoCount: number) {
  if (photoCount <= 100) {
    return 10000; // 10 seconds
  }
  if (photoCount <= 400) {
    return 15000; // 15 seconds
  }
  if (photoCount <= 800) {
    return 20000; // 20 seconds
  }
  return 30000; // 30 seconds
}

export function projectRestyleTimeoutDelay(surfaces: Surface[]) {
  const lastSurface = surfaces.sort((a, b) => a.surfaceNumber - b.surfaceNumber)[surfaces.length - 1];
  const pages = lastSurface.surfaceNumber + (isSpread(lastSurface) ? 2 : 1);

  if (pages <= 50) {
    return 10000; // 10 seconds
  }
  return 20000; // 20 seconds
}

export function projectResizeTimeoutDelay(surfaces: Surface[]) {
  return projectRestyleTimeoutDelay(surfaces);
}
