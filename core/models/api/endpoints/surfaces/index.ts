import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import { surfaceFactory } from "@/core/factories/surface";
import { eventHandler } from "@/core/utils/event-mock";
import { faker } from "@faker-js/faker";
import { projectSchema } from "@/core/models/project";
import type { z } from "zod";

export const surfaceShuffleBodySchema = projectSchema;

const surfaceAutoAdaptBodySchema = surfaceShuffleBodySchema;
const surfaceSuggestBodySchema = surfaceShuffleBodySchema;

// Infer types from schemas
export type SurfaceShuffleBody = z.infer<typeof surfaceShuffleBodySchema>;
export type SurfaceAutoAdaptBody = z.infer<typeof surfaceAutoAdaptBodySchema>;
export type SurfaceSuggestBody = z.infer<typeof surfaceSuggestBodySchema>;

export class SurfaceEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  shuffle(body: SurfaceShuffleBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/surfaces/shuffle",
        options: {
          method: "POST",
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: () => eventHandler(surfaceFactory(), "project.edited"),
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
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: () => eventHandler(surfaceFactory(), "project.edited"),
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
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: async () => {
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, () =>
            eventHandler([surfaceFactory()], "project.edited"),
          );
          return {};
        },
      });
      return res;
    });
  }
}
