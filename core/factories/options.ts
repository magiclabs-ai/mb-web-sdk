import { faker } from "@faker-js/faker";
import { Options } from "../models/options";
import { embellishmentLevels, imageDensities, imageFilteringLevels, textStickerLevels } from "../data";

export function optionsFactory(): Options {
    return {
        embellishmentLevels: faker.helpers.arrayElements(embellishmentLevels),
        textStickerLevels: faker.helpers.arrayElements(textStickerLevels),
        imageFilteringLevels: faker.helpers.arrayElements(imageFilteringLevels),
        imageDensities: faker.helpers.arrayElements(imageDensities),
    }
}
