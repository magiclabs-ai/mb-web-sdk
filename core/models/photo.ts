import { z } from "zod/v4";

// PhotoAnalyzeBody schema
export const photoAnalyzeBodySchema = z.array(
  z.object({
    id: z.string().or(z.number()),
    width: z.number(),
    height: z.number(),
    orientation: z.number(),
    url: z.string(),
    encryptId: z.string().optional(),
    timestamp: z.string().optional(),
    dateTimeDigitize: z.string().optional(),
    dateTimeOriginal: z.string().optional(),
    dateTime: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    filename: z.string().optional(),
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
  id: z.string().or(z.number()),
  filename: z.string().or(z.number()),
  width: z.number(),
  height: z.number(),
  orientation: z.number(),
  sequence: z.number(),
  encryptId: z.string().optional(),
  timestamp: z.string(),
  dateTimeDigitize: z.string().optional(),
  dateTimeOriginal: z.string().optional(),
  dateTime: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  selected: z.boolean(),
  aestheticScore: z.number(),
  categoryWeight: z.number(),
  embedding: z.array(z.number()),
  faces: z.array(faceSchema),
  labels: z.array(labelSchema),
  droppingPoint: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

// Infer types from schemas
export type PhotoAnalyzeBody = z.infer<typeof photoAnalyzeBodySchema>;
export type AnalyzedPhoto = z.infer<typeof analyzedPhotoSchema>;
export type Label = z.infer<typeof labelSchema>;
export type Face = z.infer<typeof faceSchema>;
