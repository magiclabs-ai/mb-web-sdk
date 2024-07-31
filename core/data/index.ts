export const photoDensities = ["low", "medium", "high"] as const;
export type PhotoDensity = (typeof photoDensities)[number];
export const photoFilteringLevels = ["best", "most", "all"] as const;
export type PhotoFilteringLevel = (typeof photoFilteringLevels)[number];
export const embellishmentLevels = ["none", "few", "lots"] as const;
export type EmbellishmentLevel = (typeof embellishmentLevels)[number];
export const textStickerLevels = ["none", "few", "lots"] as const;
export type TextStickerLevel = (typeof textStickerLevels)[number];
