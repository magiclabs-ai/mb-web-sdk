import type { BorderContent, LayeredItem, PhotoContent, Surface } from "@/core/models/surface";
import { faker } from "@faker-js/faker";
import { metadataFactory } from "./metadata";

export function surfaceFactory(props: Partial<Surface> = {}): Surface {
  return {
    surfaceNumber: faker.number.int(),
    surfaceData: {
      pageDetails: {
        width: faker.number.int({ min: 1000, max: 10000 }),
        height: faker.number.int({ min: 1000, max: 10000 }),
        dpi: faker.number.int({ min: 100, max: 600 }),
      },
      layeredItems: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, LayeredItemFactory),
    },
    surfaceMetadata: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, metadataFactory),
    version: "4.0",
    ...props,
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
      rot: faker.number.float({ min: 0, max: 360, multipleOf: 0.01 }),
    },
    type,
    content: photoContentFactory(),
    border: borderContentFactory(),
  };
}

function borderContentFactory(): BorderContent {
  return {
    contentType: "border",
    userData: {
      borderColor: faker.color.rgb(),
      borderOverlap: faker.number.int({ min: 0, max: 100 }),
      borderWidthPixels: faker.number.int({ min: 0, max: 100 }),
    },
  };
}

function photoContentFactory(): PhotoContent {
  return {
    contentType: "photo",
    userData: {
      assetId: faker.number.int({ min: 100, max: 4000 }).toString(),
      w: faker.number.int({ min: 100, max: 4000 }),
      h: faker.number.int({ min: 100, max: 4000 }),
      x: faker.number.int({ min: 0, max: 4000 }),
      y: faker.number.int({ min: 0, max: 4000 }),
      rot: faker.number.int({ min: 0, max: 360 }),
      journalCore: faker.lorem.word(),
    },
  };
}

export function surfacesFactory(surfaceCount: number): Surface[] {
  return Array.from({ length: surfaceCount }).map((_, index) => surfaceFactory({ surfaceNumber: index }));
}
