import type { Options } from "@/core/models/options";
import { embellishmentLevels, imageDensities, imageFilteringLevels, textStickerLevels } from "@/core/data";

export function optionsFactory(): Options {
  return {
    embellishmentLevels: [...embellishmentLevels],
    textStickerLevels: [...textStickerLevels],
    imageFilteringLevels: [...imageFilteringLevels],
    imageDensities: [...imageDensities]
  };
}
