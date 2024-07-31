import type { AnalyzedPhoto } from "@/core/models/photo";
import { faker } from "@faker-js/faker";

export function photoFactory(): AnalyzedPhoto {
  return {
    id: faker.string.uuid(),
    width: faker.number.int({ min: 100, max: 4000 }),
    height: faker.number.int({ min: 100, max: 4000 }),
    orientation: faker.number.int({ min: 0, max: 3 }),
    url: faker.image.url(),
    faces: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
      boundingBox: {
        x: faker.number.float({ min: 0, max: 1 }),
        y: faker.number.float({ min: 0, max: 1 }),
        width: faker.number.float({ min: 0, max: 1 }),
        height: faker.number.float({ min: 0, max: 1 }),
      },
      scoring: {
        smile: faker.number.float({ min: 0, max: 1 }),
        confidence: faker.number.float({ min: 0, max: 1 }),
        eyesOpen: faker.number.float({ min: 0, max: 1 }),
        facingCamera: faker.number.float({ min: 0, max: 1 }),
      },
    })),
    similarity: faker.number.float({ min: 0, max: 1 }),
    category: faker.helpers.arrayElement(["W", "P", "L"]), // Example categories
    aestheticScore: faker.number.float({ min: 0, max: 10 }),
    labels: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      name: faker.word.noun(),
      confidence: faker.number.float({ min: 0, max: 1 }),
    })),
    takenAt: faker.date.past().toISOString(),
    roi: {
      primary: {},
      maxL: {},
      maxP: {},
    },
  };
}
