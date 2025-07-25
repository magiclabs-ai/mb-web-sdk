import type { MagicBookAPI } from "../..";
import { surfaceFactory } from "@/core/factories/surface";
import { eventHandler } from "@/core/utils/event-mock";
import { faker } from "@faker-js/faker";
import { projectSchema } from "@/core/models/project";
import type { z } from "zod/v4";
import type { RequestResponse } from "@/core/models/fetcher";
import { simpleResponseFactory } from "@/core/factories/response";
import {
  surfaceAutoAdaptTimeoutDelay,
  surfaceShuffleTimeoutDelay,
  surfaceSuggestTimeoutDelay,
} from "@/core/models/surface";

export const surfaceShuffleBodySchema = projectSchema;
const surfaceAutoAdaptBodySchema = surfaceShuffleBodySchema;
const surfaceSuggestBodySchema = surfaceShuffleBodySchema;

// Infer types from schemas
export type SurfaceShuffleBody = z.infer<typeof surfaceShuffleBodySchema>;
export type SurfaceAutoAdaptBody = z.infer<typeof surfaceAutoAdaptBodySchema>;
export type SurfaceSuggestBody = z.infer<typeof surfaceSuggestBodySchema>;

type SurfaceShuffleOptions = {
  keepImageSequence?: boolean;
};

export class SurfaceEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async shuffle(body: SurfaceShuffleBody, options?: SurfaceShuffleOptions) {
    const qs = options?.keepImageSequence ? "?keep-image-sequence=true" : "";
    const path = `/designer/surfaces/shuffle${qs}`;
    const request = this.magicBookAPI.dispatcher.add(path, {
      eventType: "surface.shuffle",
      finalEventName: "surfaces.designed",
      timeoutEventName: "surfaces.designed-timeout",
      timeoutDelay: surfaceShuffleTimeoutDelay(body.surfaces[0]),
    });

    try {
      const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
        path,
        options: {
          method: "POST",
          headers: {
            "magic-request-id": request.id,
          },
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: async () => {
          eventHandler(surfaceFactory(), "surfaces.designed");
          return simpleResponseFactory();
        },
      });
      request.addEvent("fetch", path);
      return res;
    } catch (error) {
      request.addEvent("fetch", path);
      request.finish();
      throw error;
    }
  }

  async autoAdapt(body: SurfaceAutoAdaptBody) {
    const path = "/designer/surfaces/autoadapt";
    const request = this.magicBookAPI.dispatcher.add(path, {
      eventType: "surface.autoadapt",
      finalEventName: "surfaces.designed",
      timeoutEventName: "surfaces.designed-timeout",
      timeoutDelay: surfaceAutoAdaptTimeoutDelay(body.surfaces[0]),
    });

    try {
      const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
        path,
        options: {
          method: "POST",
          headers: {
            "magic-request-id": request.id,
          },
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: async () => {
          eventHandler(surfaceFactory(), "surfaces.designed");
          return simpleResponseFactory();
        },
      });
      request.addEvent("fetch", path);
      return res;
    } catch (error) {
      request.addEvent("fetch", path);
      request.finish();
      throw error;
    }
  }

  async suggest(body: SurfaceSuggestBody) {
    const path = "/designer/surfaces/suggest";
    const request = this.magicBookAPI.dispatcher.add(path, {
      eventType: "surface.suggest",
      finalEventName: "surfaces.designed",
      timeoutEventName: "surfaces.designed-timeout",
      timeoutDelay: surfaceSuggestTimeoutDelay(body.surfaces[0]),
    });

    try {
      const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
        path,
        options: {
          method: "POST",
          headers: {
            "magic-request-id": request.id,
          },
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: async () => {
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, () =>
            eventHandler([surfaceFactory()], "surfaces.designed"),
          );
          return simpleResponseFactory();
        },
      });
      request.addEvent("fetch", path);
      return res;
    } catch (error) {
      request.addEvent("fetch", path);
      request.finish();
      throw error;
    }
  }
}
