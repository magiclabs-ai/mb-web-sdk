export const imageDensities = ["low", "medium", "high"] as const;
export type imageDensity = (typeof imageDensities)[number];
export const imageFilteringLevels = ["best", "most", "all"] as const;
export type imageFilteringLevel = (typeof imageFilteringLevels)[number];
export const embellishmentLevels = ["none", "few", "lots"] as const;
export type EmbellishmentLevel = (typeof embellishmentLevels)[number];
export const textStickerLevels = ["none", "few", "lots"] as const;
export type TextStickerLevel = (typeof textStickerLevels)[number];
