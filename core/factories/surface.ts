import type { LayeredItem, PhotoContent, Surface } from "@/core/models/surface";
import { faker } from "@faker-js/faker";
import { metadataFactory } from "./metadata";

export function surfaceFactory(): Surface {
  return {
    surfaceNumber: faker.number.int(),
    surfaceData: {
      pageDetails: {
        width: faker.number.int({ min: 1000, max: 10000 }),
        height: faker.number.int({ min: 1000, max: 10000 }),
        dpi: faker.number.int({ min: 100, max: 600 }),
      },
      layeredItems: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, LayeredItemFactory),
    },
    surfaceMetadata: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, metadataFactory),
    version: "4.0",
  };
}

function LayeredItemFactory(): LayeredItem {
  const type = faker.helpers.arrayElement(["photo"]) as "photo";
  return {
    layerMetadata: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, metadataFactory),
    container: {
      x: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
      y: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
      w: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
      h: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
      rotation: faker.number.float({ min: 0, max: 360, multipleOf: 0.01 }),
    },
    type,
    content: photoContentFactory(),
  };
}

function photoContentFactory(): PhotoContent {
  return {
    contentType: "photo",
    userData: {
      assetId: faker.string.uuid(),
      w: faker.number.int({ min: 100, max: 4000 }),
      h: faker.number.int({ min: 100, max: 4000 }),
      x: faker.number.int({ min: 0, max: 4000 }),
      y: faker.number.int({ min: 0, max: 4000 }),
      rot: faker.number.int({ min: 0, max: 360 }),
      journalCore: faker.lorem.word(),
    },
  };
}
