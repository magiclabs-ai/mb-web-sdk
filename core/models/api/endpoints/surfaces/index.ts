import type { MagicBookAPI } from "../..";
import { camelCaseObjectKeysToSnakeCase, handleAsyncFunction } from "@/core/utils/toolbox";
import { surfaceFactory } from "@/core/factories/surface";
import { eventHandler } from "@/core/utils/event-mock";
import type { SurfaceShuffleBody, SurfaceAutoAdaptBody, SurfaceSuggestBody } from "@/core/models/surface";
import { faker } from "@faker-js/faker";

export class SurfaceEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  shuffle(body: SurfaceShuffleBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/surfaces/shuffle",
        options: {
          method: "POST",
          body: JSON.stringify(camelCaseObjectKeysToSnakeCase(body)),
        },
        factory: () => eventHandler(surfaceFactory(), "surface.shuffle"),
      });
      return res;
    });
  }

  autoAdapt(body: SurfaceAutoAdaptBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/surfaces/autoadapt",
        options: {
          method: "POST",
          body: JSON.stringify(camelCaseObjectKeysToSnakeCase(body)),
        },
        factory: () => eventHandler(surfaceFactory(), "surface.autoAdapt"),
      });
      return res;
    });
  }

  suggest(body: SurfaceSuggestBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/surfaces/suggest",
        options: {
          method: "POST",
          body: JSON.stringify(camelCaseObjectKeysToSnakeCase(body)),
        },
        factory: () =>
          eventHandler(
            Array.from({ length: faker.number.int({ min: 2, max: 10 }) }).map(surfaceFactory),
            "surface.suggest",
          ),
      });
      return res;
    });
  }
}
