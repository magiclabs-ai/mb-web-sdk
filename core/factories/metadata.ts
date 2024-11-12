import type { Metadata } from "@/core/models/metadata";
import { faker } from "@faker-js/faker";

export function metadataFactory(): Metadata {
  return {
    metadataType: faker.lorem.word(),
    name: faker.lorem.word(),
    value: faker.lorem.word(),
  };
}
