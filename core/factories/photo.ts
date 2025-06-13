import type { AnalyzedPhoto, PhotoAnalyzeBody } from "@/core/models/photo";
import { faker } from "@faker-js/faker";

export function photoFactory(): AnalyzedPhoto {
  const photo: AnalyzedPhoto = {
    id: faker.number.int({ min: 1, max: 100 }).toString(),
    roi: {
      x: faker.number.float({ min: 0, max: 1 }),
      y: faker.number.float({ min: 0, max: 1 }),
      width: faker.number.float({ min: 0, max: 1 }),
      height: faker.number.float({ min: 0, max: 1 }),
    },
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
    aestheticScore: faker.number.float({ min: 0, max: 1 }),
    categoryWeight: faker.number.float({ min: 0, max: 1 }),
    filename: faker.system.fileName(),
    width: faker.number.int({ min: 100, max: 4000 }),
    height: faker.number.int({ min: 100, max: 4000 }),
    orientation: faker.number.int({ min: 0, max: 3 }),
    sequence: faker.number.int({ min: 0, max: 3 }),
    selected: faker.datatype.boolean(),
    embedding: Array.from({ length: 128 }, () => faker.number.float({ min: 0, max: 1 })),
    labels: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
      name: faker.lorem.word(),
      confidence: faker.number.float({ min: 0, max: 1 }),
    })),
    timestamp: faker.date.past().toISOString(),
    droppingPoint: {
      x: faker.number.float({ min: 0, max: 1 }),
      y: faker.number.float({ min: 0, max: 1 }),
    },
  };
  return photo;
}

export function photoAnalyzeBodyFactory(): PhotoAnalyzeBody {
  return Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    id: faker.number.int({ min: 1, max: 5 }).toString(),
    width: faker.number.int({ min: 100, max: 4000 }),
    height: faker.number.int({ min: 100, max: 4000 }),
    orientation: faker.number.int({ min: 0, max: 3 }),
    url: faker.image.url(),
  }));
}
