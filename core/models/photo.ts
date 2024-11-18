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

// AnalyzedPhoto schema
export const analyzedPhotoSchema = z.object({
  roi: roiSchema,
  id: z.string(),
  filename: z.string(),
  width: z.number(),
  height: z.number(),
  orientation: z.number(),
  sequence: z.number(),
  timestamp: z.string(),
  selected: z.boolean(),
  aestheticScore: z.number(),
  categoryWeight: z.number(),
  embedding: z.array(z.number()),
  faces: z.array(faceSchema),
  labels: z.array(labelSchema),
});

// Infer types from schemas
export type PhotoAnalyzeBody = z.infer<typeof photoAnalyzeBodySchema>;
export type AnalyzedPhoto = z.infer<typeof analyzedPhotoSchema>;
export type Label = z.infer<typeof labelSchema>;
export type Face = z.infer<typeof faceSchema>;
