import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import { surfaceFactory } from "@/core/factories/surface";
import { eventHandler } from "@/core/utils/event-mock";
import type {
  SurfaceAutofillBody,
  SurfaceShuffleBody,
  SurfaceAutoAdaptBody,
  SurfaceSuggestBody,
} from "@/core/models/surface";
import { faker } from "@faker-js/faker";

export class SurfaceEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  autofill(body: SurfaceAutofillBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/surface/autofill",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: () => eventHandler(surfaceFactory(), "surface.autofill"),
      });
      return res;
    });
  }

  shuffle(body: SurfaceShuffleBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/surface/shuffle",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: () => eventHandler(surfaceFactory(), "surface.shuffle"),
      });
      return res;
    });
  }

  autoAdapt(body: SurfaceAutoAdaptBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/surface/autoadapt",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: () => eventHandler(surfaceFactory(), "surface.autoAdapt"),
      });
      return res;
    });
  }

  suggest(body: SurfaceSuggestBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/surface/suggest",
        options: {
          method: "POST",
          body: JSON.stringify(body),
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
