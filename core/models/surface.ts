import { metadataSchema } from "@/core/models/metadata";
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
    w: z.number(),
    h: z.number(),
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

export type Surface = z.infer<typeof surfaceSchema>;
export type LayeredItem = z.infer<typeof layeredItemSchema>;
export type PhotoContent = z.infer<typeof photoContentSchema>;
