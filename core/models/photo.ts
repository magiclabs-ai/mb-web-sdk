import { z } from "zod";

// PhotoAnalyzeBody schema
export const photoAnalyzeBodySchema = z.array(
  z.object({
    id: z.string(),
    width: z.number(),
    height: z.number(),
    orientation: z.number(),
    url: z.string(),
  }),
);

// Label schema
export const labelSchema = z.object({
  name: z.string(),
  confidence: z.number(),
});

// Face schema
export const faceSchema = z.object({
  boundingBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  scoring: z.object({
    smile: z.number(),
    confidence: z.number(),
    eyesOpen: z.number(),
    facingCamera: z.number(),
  }),
});

const roiSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

// Roi schema
export const roiObjectSchema = z.object({
  primary: roiSchema,
  maxL: roiSchema,
  maxP: roiSchema,
});

// AnalyzedPhoto schema
export const analyzedPhotoSchema = z.object({
  id: z.string(),
  width: z.number(),
  height: z.number(),
  orientation: z.number(),
  url: z.string(),
  faces: z.array(faceSchema),
  similarity: z.number(),
  category: z.string(),
  aestheticScore: z.number(),
  labels: z.array(labelSchema),
  takenAt: z.string(),
  roi: roiObjectSchema,
});

// Infer types from schemas
export type PhotoAnalyzeBody = z.infer<typeof photoAnalyzeBodySchema>;
export type AnalyzedPhoto = z.infer<typeof analyzedPhotoSchema>;
export type Label = z.infer<typeof labelSchema>;
export type Face = z.infer<typeof faceSchema>;
export type Roi = z.infer<typeof roiObjectSchema>;
