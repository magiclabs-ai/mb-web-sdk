import { metadataSchema } from "@/core/models/metadata";
import { analyzedPhotoSchema } from "@/core/models/photo";
import { surfaceSchema } from "@/core/models/surface";
import { z } from "zod";

export const projectSchema = z.object({
  id: z.string(),
  metadata: z.array(metadataSchema),
  surfaces: z.array(surfaceSchema),
  photos: z.array(analyzedPhotoSchema),
});

export const projectAutofillBodySchema = z.object({
  photos: z.array(analyzedPhotoSchema),
  metadata: z.array(metadataSchema),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectAutofillBody = z.infer<typeof projectAutofillBodySchema>;
