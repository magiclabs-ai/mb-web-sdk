import type { AnalyzedPhoto } from "@/core/models/photo";
import { faker } from "@faker-js/faker";

export function photoFactory(): AnalyzedPhoto {
  return {
    id: faker.string.uuid(),
    url: faker.image.url(),
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
    handle: faker.string.uuid(),
    filename: faker.system.fileName(),
    width: faker.number.int({ min: 100, max: 4000 }),
    height: faker.number.int({ min: 100, max: 4000 }),
    orientation: faker.number.int({ min: 0, max: 3 }),
    sequence: faker.number.int({ min: 0, max: 3 }),
    takenAt: faker.date.past().toISOString(),
    takenAtOffset: faker.number.int({ min: 0, max: 1000 }),
    cameraMake: faker.lorem.word(),
    camera: faker.lorem.word(),
    similarity: faker.number.float({ min: 0, max: 1 }),
    selected: faker.datatype.boolean(),
    favorite: faker.datatype.boolean(),
    longitude: faker.location.longitude(),
    latitude: faker.location.latitude(),
    createdAt: faker.date.past().toISOString(),
    ingestionStartedAt: faker.date.past().toISOString(),
    ingestionAt: faker.date.past().toISOString(),
  };
}
