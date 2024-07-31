import { metadataSchema } from "@/core/models/metadata";
import { analyzedPhotoSchema } from "@/core/models/photo";
import { z } from "zod";

const backgroundContentSchema = z.object({
  type: z.string(),
  userData: z.object({
    font: z
      .object({
        family: z.string(),
        size: z.number(),
        color: z.string(),
      })
      .optional(),
    lineSpacing: z.number().optional(),
    lines: z
      .array(
        z.object({
          x: z.number(),
          y: z.number(),
          text: z.string(),
        }),
      )
      .optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    assetId: z.string().optional(),
  }),
});

const textContentSchema = z.object({
  type: z.string(),
  userData: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    assetId: z.string(),
  }),
});

const layeredItemSchema = z.object({
  container: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  type: z.enum(["background", "text"]),
  content: z.union([backgroundContentSchema, textContentSchema]),
});

export const surfaceSchema = z.object({
  id: z.string(),
  number: z.number(),
  data: z.object({
    pageDetails: z.object({
      width: z.number(),
      height: z.number(),
    }),
    layeredItems: z.array(layeredItemSchema),
  }),
});

const surfaceAutofillBodySchema = z.object({
  photos: z.array(analyzedPhotoSchema),
  metadata: z.array(metadataSchema),
});

const surfaceShuffleBodySchema = z.object({
  surface: surfaceSchema,
  photos: z.array(analyzedPhotoSchema),
});

const surfaceAutoAdaptBodySchema = surfaceShuffleBodySchema;
const surfaceSuggestBodySchema = surfaceShuffleBodySchema;

const surfacePhotoResizeBodySchema = z.object({
  id: z.string(),
  surfaces: z.array(surfaceSchema),
  photos: z.array(analyzedPhotoSchema),
});

// Infer types from schemas
export type SurfaceAutofillBody = z.infer<typeof surfaceAutofillBodySchema>;
export type SurfaceShuffleBody = z.infer<typeof surfaceShuffleBodySchema>;
export type SurfaceAutoAdaptBody = z.infer<typeof surfaceAutoAdaptBodySchema>;
export type SurfaceSuggestBody = z.infer<typeof surfaceSuggestBodySchema>;
export type SurfacePhotoResizeBody = z.infer<typeof surfacePhotoResizeBodySchema>;
export type Surface = z.infer<typeof surfaceSchema>;
export type LayeredItem = z.infer<typeof layeredItemSchema>;
export type BackgroundContent = z.infer<typeof backgroundContentSchema>;
export type TextContent = z.infer<typeof textContentSchema>;
