import { z } from "zod/v4";
import { photoDeprecationWarningThreshold } from "../config";
import type { AddEvent, DispatcherEvent } from "./dispatcher";

// PhotoAnalyzeBody schema
export const photoAnalyzeBodySchema = z.array(
  z.object({
    id: z.string(),
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
  scoring: z
    .object({
      smile: z.number(),
      confidence: z.number(),
      eyesOpen: z.number(),
      facingCamera: z.number(),
    })
    .optional(),
});

const roiSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

// AnalyzedPhoto schema
export const analyzedPhotoSchema = z.object({
  id: z.string(),
  roi: roiSchema.optional(),
  filename: z.string().or(z.number()),
  width: z.number(),
  height: z.number(),
  orientation: z.number(),
  sequence: z.number().optional(),
  encryptId: z.string().optional(),
  timestamp: z.string(),
  dateTimeDigitize: z.string().optional(),
  dateTimeOriginal: z.string().optional(),
  dateTime: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  selected: z.boolean(),
  aestheticScore: z.number().optional(),
  categoryWeight: z.number().optional(),
  embedding: z.array(z.number()).optional(),
  faces: z.array(faceSchema).optional(),
  labels: z.array(labelSchema).optional(),
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

export function photoDeprecationCheck(events: DispatcherEvent[], addEvent: AddEvent, requestId: string) {
  const analyzedPhotos = events
    .filter((event) => event.name === "photo.analyzed" && event.message?.result)
    .map((event) => event.message!.result as AnalyzedPhoto);

  if (!analyzedPhotos.length) return;

  const unselectedCount = analyzedPhotos.filter((photo) => !photo.selected).length;
  const unselectedPercentage = (unselectedCount * 100) / analyzedPhotos.length;

  if (unselectedPercentage > photoDeprecationWarningThreshold) {
    const eventName = "warning.photo-access-deprecated";
    addEvent("ws", eventName, {
      eventName,
      requestId,
    });
  }
}

export function photoAnalyzeTimeoutDelay(photoCount: number) {
  if (photoCount <= 100) {
    return 10000; // 10 seconds
  }
  if (photoCount <= 400) {
    return 15000; // 15 seconds
  }
  if (photoCount <= 800) {
    return 20000; // 20 seconds
  }
  return 30000; // 30 seconds
}
