import { z } from "zod";
import { embellishmentLevels, imageDensities, imageFilteringLevels, textStickerLevels } from "@/core/data";

export const optionsSchema = z.object({
    embellishmentLevels: z.array(z.enum(embellishmentLevels)),
    textStickerLevels: z.array(z.enum(textStickerLevels)),
    imageFilteringLevels: z.array(z.enum(imageFilteringLevels)),
    imageDensities: z.array(z.enum(imageDensities)),
});

// Infer types from schemas
export type Options = z.infer<typeof optionsSchema>;
