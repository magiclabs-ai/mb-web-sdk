import type { MagicBookAPI } from "../..";
import { surfaceFactory } from "@/core/factories/surface";
import { eventHandler } from "@/core/utils/event-mock";
import { faker } from "@faker-js/faker";
import { projectSchema } from "@/core/models/project";
import type { z } from "zod";
import type { RequestResponse } from "@/core/models/fetcher";
import { simpleResponseFactory } from "@/core/factories/response";

export const surfaceShuffleBodySchema = projectSchema;
const surfaceAutoAdaptBodySchema = surfaceShuffleBodySchema;
const surfaceSuggestBodySchema = surfaceShuffleBodySchema;

// Infer types from schemas
export type SurfaceShuffleBody = z.infer<typeof surfaceShuffleBodySchema>;
export type SurfaceAutoAdaptBody = z.infer<typeof surfaceAutoAdaptBodySchema>;
export type SurfaceSuggestBody = z.infer<typeof surfaceSuggestBodySchema>;

export class SurfaceEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async shuffle(body: SurfaceShuffleBody) {
    const path = "/designer/surfaces/shuffle";
    const log = this.magicBookAPI.logger?.add(path);
    const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
      path,
      options: {
        method: "POST",
        body: this.magicBookAPI.bodyParse(body),
      },
      factory: async () => {
        eventHandler(surfaceFactory(), "surfaces.designed");
        return simpleResponseFactory();
      },
    });
    if (log) {
      log.id = res.requestId;
      log.addSubProcess("fetch", path);
    }
    return res;
  }

  async autoAdapt(body: SurfaceAutoAdaptBody) {
    const path = "/designer/surfaces/autoadapt";
    const log = this.magicBookAPI.logger?.add(path);
    const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
      path,
      options: {
        method: "POST",
        body: this.magicBookAPI.bodyParse(body),
      },
      factory: async () => {
        eventHandler(surfaceFactory(), "surfaces.designed");
        return simpleResponseFactory();
      },
    });
    if (log) {
      log.id = res.requestId;
      log.addSubProcess("fetch", path);
    }
    return res;
  }

  async suggest(body: SurfaceSuggestBody) {
    const path = "/designer/surfaces/suggest";
    const log = this.magicBookAPI.logger?.add(path);
    const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
      path,
      options: {
        method: "POST",
        body: this.magicBookAPI.bodyParse(body),
      },
      factory: async () => {
        Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, () =>
          eventHandler([surfaceFactory()], "surfaces.designed"),
        );
        return simpleResponseFactory();
      },
    });
    if (log) {
      log.id = res.requestId;
      log.addSubProcess("fetch", path);
    }
    return res;
  }
}
