/**
 * Cover surfaces transcribed from the Solution Design "Pass Populated Cover Surfaces to MagicLabs"
 * §3.3 — a real captured Autofill request payload for the "The Best Mom" IdeaPage (`DA_4177725`).
 *
 * The spec documents the snake_case wire format; Builder builds these objects in camelCase and the
 * SDK's `bodyParse` converts them. These fixtures are therefore camelCase, matching what a caller
 * actually hands to `projects.autofill()`.
 *
 * Front cover: 1 background, 4 embellishments, 1 empty photo well, 3 text layers carrying authored
 * copy ("The Best" / "Mom" / "we love you"). Per the spec these text layers are frequently pre-filled
 * with real copy rather than blank placeholders, and must pass through untouched.
 */

import type { AutofillSurface, LayeredItem } from "@/core/models/surface";

/** An empty photo well: zeroed `userData` dimensions and no `assetId` at all (spec §3.2). */
export const emptyPhotoWell: LayeredItem = {
  type: "photo",
  content: {
    contentType: "UserPhoto",
    userData: { w: 0, h: 0, x: 0, y: 0, rot: 0 },
  },
  container: { w: 1873.02, h: 1207.1001, x: 488.49002, y: 1158.7762, rot: 0 },
  layerMetadata: [{ name: "designAssetOperation", value: "original_add", metadataType: "Reporting" }],
};

const backgroundLayer: LayeredItem = {
  type: "background",
  content: {
    contentType: "DesignBackground",
    userData: { assetId: "DA_4177508", w: 3510, h: 3510, x: -202.5, y: 0, rot: 0 },
  },
  container: { w: 3105, h: 3510, x: 0, y: 0, rot: 0 },
  layerMetadata: [
    { name: "designAssetId", value: "DA_4177508", metadataType: "Builder" },
    { name: "designAssetCategoryId", value: "DA_4177525", metadataType: "Builder" },
    { name: "designAssetOperation", value: "original_add", metadataType: "Reporting" },
  ],
};

function embellishmentLayer(x: number, y: number): LayeredItem {
  return {
    type: "embellishment",
    content: {
      contentType: "Embellishment",
      userData: { assetId: "DA_4177509", w: 2987.5, h: 182.01208, x, y, rot: 0 },
    },
    container: { w: 2987.5, h: 182.01208, x, y, rot: 180 },
    layerMetadata: [
      { name: "designAssetId", value: "DA_4177509", metadataType: "Builder" },
      // A real captured value: the spec allows the literal string "unavailable" here.
      { name: "designAssetCategoryId", value: "unavailable", metadataType: "Builder" },
      { name: "designAssetOperation", value: "original_add", metadataType: "Reporting" },
    ],
  };
}

const embellishmentLayers = [
  embellishmentLayer(417.5869, 438.3333),
  embellishmentLayer(417.5869, 2885.4878),
  embellishmentLayer(-529.10864, 438.3333),
  embellishmentLayer(-529.10864, 2885.4878),
];

function textLayer({
  textClass,
  fontSize,
  alignmentAnchor,
  text,
  lineX,
  lineY,
  container,
}: {
  textClass: string;
  fontSize: number;
  alignmentAnchor: string;
  text: string;
  lineX: number;
  lineY: number;
  container: { w: number; h: number; x: number; y: number; rot: number };
}): LayeredItem {
  return {
    type: "text",
    content: {
      contentType: "UserText",
      textClass,
      userData: {
        assetId: "DA_46452",
        fontSize,
        fontColor: "#FFFFFF",
        alignmentAnchor,
        linesOfText: [{ x: lineX, y: lineY, userLineFeed: false, text }],
        fullText: text,
        isCustomDesigned: false,
        userEditedText: false,
      },
    },
    container,
    layerMetadata: [
      { name: "fontColor", value: "CMYK(0,0,0,0)", metadataType: "Renderer" },
      { name: "colorSwatch", value: "#FFFFFF", metadataType: "Reporting" },
      { name: "designAssetOperation", value: "original_add", metadataType: "Reporting" },
    ],
  };
}

export const textLayers = [
  textLayer({
    textClass: "headline",
    fontSize: 72,
    alignmentAnchor: "7",
    text: "The Best",
    lineX: 0,
    lineY: 385.37122,
    container: { w: 1745.3895, h: 385.37122, x: 552.3054, y: 810, rot: 0 },
  }),
  textLayer({
    textClass: "headline",
    fontSize: 72,
    alignmentAnchor: "3",
    text: "Mom",
    lineX: 1084.4894755859375,
    lineY: 219,
    container: { w: 1745.3895, h: 325.37125, x: 552.3054, y: 2314.629, rot: 0 },
  }),
  textLayer({
    textClass: "subtitle",
    fontSize: 16,
    alignmentAnchor: "3",
    text: "we love you",
    lineX: 1396.0244487304687,
    lineY: 48.66666666666666,
    container: { w: 1745.3895, h: 150.21584, x: 552.3054, y: 2619.7842, rot: 0 },
  }),
];

const coverSurfaceMetadata = [
  { name: "templateName", metadataType: "string", value: "" },
  { name: "surfaceCategory", metadataType: "string", value: "cover" },
];

/** Front cover, `surfaceNumber: -2`. */
export const frontCoverSurface: AutofillSurface = {
  surfaceType: "front",
  layoutId: "DA_4177725",
  surfaceNumber: -2,
  surfaceData: {
    pageDetails: { width: 3105, height: 3510, dpi: 300 },
    layeredItems: [backgroundLayer, ...embellishmentLayers, emptyPhotoWell, ...textLayers],
  },
  surfaceMetadata: coverSurfaceMetadata,
  version: "4.0",
};

/**
 * Back cover, `surfaceNumber: -4`. Per spec §3.3 the back cover uses the same schema and layer shapes
 * as the front; only `surfaceType`, `surfaceNumber` and `layoutId` differ.
 */
const backCoverSurface: AutofillSurface = {
  ...frontCoverSurface,
  surfaceType: "back",
  layoutId: "DA_4177726",
  surfaceNumber: -4,
};

/** The two-entry array the spec mandates for this phase: front (-2) and back (-4) only. */
export const coverSurfaces = [frontCoverSurface, backCoverSurface];
