import { faker } from "@faker-js/faker";
import type { DesignOptionsDensitiesResponse } from "@/core/models/api";

export function densitiesFactory(): DesignOptionsDensitiesResponse {
  return {
    densities: {
      low: {
        minImageCount: faker.number.int({ min: 1, max: 10 }),
        avgImageCount: faker.number.int({ min: 1, max: 10 }),
        maxImageCount: faker.number.int({ min: 1, max: 10 }),
        minPageCount: faker.number.int({ min: 1, max: 10 }),
        maxPageCount: faker.number.int({ min: 1, max: 10 }),
      },
      medium: {
        minImageCount: faker.number.int({ min: 1, max: 10 }),
        avgImageCount: faker.number.int({ min: 1, max: 10 }),
        maxImageCount: faker.number.int({ min: 1, max: 10 }),
        minPageCount: faker.number.int({ min: 1, max: 10 }),
        maxPageCount: faker.number.int({ min: 1, max: 10 }),
      },
      high: {
        minImageCount: faker.number.int({ min: 1, max: 10 }),
        avgImageCount: faker.number.int({ min: 1, max: 10 }),
        maxImageCount: faker.number.int({ min: 1, max: 10 }),
        minPageCount: faker.number.int({ min: 1, max: 10 }),
        maxPageCount: faker.number.int({ min: 1, max: 10 }),
      },
    },
  };
}
