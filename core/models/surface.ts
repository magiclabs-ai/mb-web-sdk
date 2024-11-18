import { metadataSchema } from "@/core/models/metadata";
import { analyzedPhotoSchema } from "@/core/models/photo";
import { z } from "zod";

const photoContentSchema = z.object({
  contentType: z.string(),
  userData: z.object({
    assetId: z.string(),
    w: z.number(),
    h: z.number(),
    x: z.number(),
    y: z.number(),
    rot: z.number(),
    journalCore: z.string(),
  }),
});

const layeredItemSchema = z.object({
  container: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    rotation: z.number(),
  }),
  type: z.enum(["photo"]),
  content: photoContentSchema,
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

const surfaceShuffleBodySchema = z.object({
  surface: z.array(surfaceSchema),
  images: z.array(analyzedPhotoSchema),
});

const surfaceAutoAdaptBodySchema = surfaceShuffleBodySchema;
const surfaceSuggestBodySchema = surfaceShuffleBodySchema;

// Infer types from schemas
export type SurfaceShuffleBody = z.infer<typeof surfaceShuffleBodySchema>;
export type SurfaceAutoAdaptBody = z.infer<typeof surfaceAutoAdaptBodySchema>;
export type SurfaceSuggestBody = z.infer<typeof surfaceSuggestBodySchema>;

export type Surface = z.infer<typeof surfaceSchema>;
export type LayeredItem = z.infer<typeof layeredItemSchema>;
// export type BackgroundContent = z.infer<typeof backgroundContentSchema>;
// export type TextContent = z.infer<typeof textContentSchema>;
export type PhotoContent = z.infer<typeof photoContentSchema>;
