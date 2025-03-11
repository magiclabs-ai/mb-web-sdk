import type { RequestResponse } from "../models/fetcher";
import { faker } from "@faker-js/faker";

export function simpleResponseFactory(): RequestResponse {
  return {
    requestId: faker.string.ulid(),
  };
}
