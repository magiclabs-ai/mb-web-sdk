import type { AnalyzedPhoto } from "@/core/models/photo";
import { faker } from "@faker-js/faker";

export function photoFactory(): AnalyzedPhoto {
  return {
    id: faker.string.uuid(),
    url: faker.image.url(),
    roi: {
      primary: {
        x: faker.number.float({ min: 0, max: 1 }),
        y: faker.number.float({ min: 0, max: 1 }),
        width: faker.number.float({ min: 0, max: 1 }),
        height: faker.number.float({ min: 0, max: 1 }),
      },
      maxL: {
        x: faker.number.float({ min: 0, max: 1 }),
        y: faker.number.float({ min: 0, max: 1 }),
        width: faker.number.float({ min: 0, max: 1 }),
        height: faker.number.float({ min: 0, max: 1 }),
      },
      maxP: {
        x: faker.number.float({ min: 0, max: 1 }),
        y: faker.number.float({ min: 0, max: 1 }),
        width: faker.number.float({ min: 0, max: 1 }),
        height: faker.number.float({ min: 0, max: 1 }),
      },
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
    handle: faker.string.uuid(),
    filename: faker.system.fileName(),
    width: faker.number.int({ min: 100, max: 4000 }),
    height: faker.number.int({ min: 100, max: 4000 }),
    orientation: faker.number.int({ min: 0, max: 3 }),
    sequence: faker.number.int({ min: 0, max: 3 }),
    taken_at: faker.date.past().toISOString(),
    taken_at_offset: faker.number.int({ min: 0, max: 1000 }),
    camera_make: faker.lorem.word(),
    camera: faker.lorem.word(),
    similarity: faker.number.float({ min: 0, max: 1 }),
    selected: faker.datatype.boolean(),
    favorite: faker.datatype.boolean(),
    longitude: faker.location.longitude(),
    latitude: faker.location.latitude(),
    created_at: faker.date.past().toISOString(),
    ingestion_started_at: faker.date.past().toISOString(),
    ingestion_at: faker.date.past().toISOString(),
  };
}
