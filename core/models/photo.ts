import { z } from "zod";

// PhotoAnalyzeBody schema
export const photoAnalyzeBodySchema = z.array(
  z.object({
    id: z.string(),
    width: z.number(),
    height: z.number(),
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
  url: z.string(),
  roi: roiObjectSchema,
  faces: z.array(faceSchema),
  handle: z.string(),
  filename: z.string(),
  width: z.number(),
  height: z.number(),
  orientation: z.number(),
  sequence: z.number(),
  taken_at: z.string(),
  taken_at_offset: z.number(),
  camera_make: z.string(),
  camera: z.string(),
  similarity: z.number(),
  selected: z.boolean(),
  favorite: z.boolean(),
  longitude: z.number(),
  latitude: z.number(),
  created_at: z.string(),
  ingestion_started_at: z.string(),
  ingestion_at: z.string(),
});

// Infer types from schemas
export type PhotoAnalyzeBody = z.infer<typeof photoAnalyzeBodySchema>;
export type AnalyzedPhoto = z.infer<typeof analyzedPhotoSchema>;
export type Label = z.infer<typeof labelSchema>;
export type Face = z.infer<typeof faceSchema>;
export type Roi = z.infer<typeof roiObjectSchema>;
