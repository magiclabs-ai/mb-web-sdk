import { analyzedPhotoSchema } from "@/core/models/photo";
import { z } from "zod";
import { surfaceSchema } from "./surface";

export const projectSchema = z.object({
  designMode: z.string(),
  occasion: z.string(),
  style: z.string(),
  imageDensityLevel: z.string(),
  embellishmentLevel: z.string(),
  bookFormat: z.object({
    targetPageRange: z.array(z.number()),
    page: z.object({
      width: z.number(),
      height: z.number(),
    }),
    cover: z.object({
      width: z.number(),
      height: z.number(),
    }),
  }),
  images: z.array(analyzedPhotoSchema),
  surfaces: z.array(surfaceSchema),
});

export const projectAutofillBodySchema = projectSchema.omit({
  surfaces: true,
});

export type Project = z.infer<typeof projectSchema>;
