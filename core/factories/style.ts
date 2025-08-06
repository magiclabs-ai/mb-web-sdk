import { faker } from "@faker-js/faker";
import type { ListStylesResponse, Style } from "@/core/models/style";

export function styleFactory(): Style {
  return {
    id: faker.string.ulid(),
    name: faker.lorem.word(),
    fonts: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
      id: faker.string.ulid(),
      name: faker.lorem.word(),
      family: faker.lorem.word(),
    })),
  };
}

export function listStylesFactory(): ListStylesResponse {
  return {
    items: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => styleFactory()),
    nextCursor: faker.string.uuid(),
  };
}
