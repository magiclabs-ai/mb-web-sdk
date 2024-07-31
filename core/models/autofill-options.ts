import { embellishmentLevels, textStickerLevels, photoFilteringLevels, photoDensities } from "@/core/data";

import { z } from "zod";

export const AutofillOptionsSchema = z.object({
  embellishmentLevels: z.array(z.enum(embellishmentLevels)),
  textStickerLevels: z.array(z.enum(textStickerLevels)),
  photoFilteringLevels: z.array(z.enum(photoFilteringLevels)),
  photoDensities: z.array(z.enum(photoDensities)),
});

export type AutofillOptions = z.infer<typeof AutofillOptionsSchema>;
