import type { BackgroundContent, LayeredItem, Surface, TextContent } from "@/core/models/surface";
import { faker } from "@faker-js/faker";

export function surfaceFactory(): Surface {
  return {
    id: faker.string.uuid(),
    number: faker.number.int(),
    data: {
      pageDetails: {
        width: faker.number.int({ min: 1000, max: 10000 }),
        height: faker.number.int({ min: 1000, max: 10000 }),
      },
      layeredItems: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, createRandomLayeredItem),
    },
  };
}

function createRandomLayeredItem(): LayeredItem {
  const type = faker.helpers.arrayElement(["background", "text"]) as "background" | "text";
  return {
    container: {
      x: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
      y: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
      width: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
      height: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
    },
    type,
    content: type === "background" ? createRandomBackgroundContent() : createRandomTextContent(),
  };
}

function createRandomBackgroundContent(): BackgroundContent {
  return {
    type: faker.lorem.words(3),
    userData: faker.helpers.arrayElement([
      {
        font: {
          family: faker.lorem.words(2),
          size: faker.number.float({ min: 8, max: 72, multipleOf: 0.01 }),
          color: faker.color.human(),
        },
        lineSpacing: faker.number.float({ min: 1, max: 2, multipleOf: 0.01 }),
        lines: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
          x: faker.number.float({ min: 0, max: 1000, multipleOf: 0.01 }),
          y: faker.number.float({ min: 0, max: 1000, multipleOf: 0.01 }),
          text: faker.lorem.words(3),
        })),
      },
      {
        x: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
        y: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
        width: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
        height: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
        assetId: faker.string.uuid(),
      },
    ]),
  };
}

function createRandomTextContent(): TextContent {
  return {
    type: faker.lorem.words(2),
    userData: {
      x: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
      y: faker.number.float({ min: 0, max: 5000, multipleOf: 0.01 }),
      width: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
      height: faker.number.float({ min: 10, max: 3000, multipleOf: 0.01 }),
      assetId: faker.string.uuid(),
    },
  };
}
