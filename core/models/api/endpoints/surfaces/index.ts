import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
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
          body: JSON.stringify(body),
        },
        factory: () => eventHandler(surfaceFactory(), "surface.shuffled"),
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
          body: JSON.stringify(body),
        },
        factory: () => eventHandler(surfaceFactory(), "surface.autoAdapted"),
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
          body: JSON.stringify(body),
        },
        factory: async () => {
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, () =>
            eventHandler([surfaceFactory()], "surface.suggested"),
          );
          return {};
        },
      });
      return res;
    });
  }
}
