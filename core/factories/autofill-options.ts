import { embellishmentLevels, photoDensities, photoFilteringLevels, textStickerLevels } from "@/core/data";
import type { AutofillOptions } from "@/core/models/autofill-options";
import { faker } from "@faker-js/faker";

export function AutofillOptionsFactory(): Promise<AutofillOptions> {
  return new Promise((resolve) =>
    resolve({
      embellishmentLevels: faker.helpers.arrayElements(embellishmentLevels),
      textStickerLevels: faker.helpers.arrayElements(textStickerLevels),
      photoFilteringLevels: faker.helpers.arrayElements(photoFilteringLevels),
      photoDensities: faker.helpers.arrayElements(photoDensities),
    }),
  );
}
