import { analyzedPhotoSchema } from "@/core/models/photo";
import { z } from "zod";
import { metadataSchema } from "./metadata";
import { surfaceSchema } from "./surface";

export const projectSchema = z.object({
  id: z.string(),
  metadata: z.array(metadataSchema),
  surfaces: z.array(surfaceSchema),
  photos: z.array(analyzedPhotoSchema),
});

export const projectAutofillBodySchema = z.object({
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
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectAutofillBody = z.infer<typeof projectAutofillBodySchema>;
