import type { Project, projectAutofillBodySchema } from "@/core/models/project";
import type { MagicBookAPI } from "../..";
import type { z } from "zod/v4";
import { formatObject } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import { surfaceFactory } from "@/core/factories/surface";
import { faker } from "@faker-js/faker";
import { optionsFactory } from "@/core/factories/options";
import { type Options, optionsSchema } from "@/core/models/options";
import type { RequestResponse } from "@/core/models/fetcher";
import { simpleResponseFactory } from "@/core/factories/response";

export type ProjectAutofillBody = z.infer<typeof projectAutofillBodySchema>;

type ProjectAutofillResponse = {
  requestId: string;
  options: Options;
};

export class ProjectEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async autofill(body: ProjectAutofillBody) {
    const path = "/designer/projects/autofill";
    const request = this.magicBookAPI.dispatcher.add(path, {
      finalEventName: "surfaces.designed",
      timeoutEventName: "surfaces.designedTimeout",
    });
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
  }

  async autofillOptions(imageCount: number) {
    const path = `/designer/projects/autofill/options?image_count=${imageCount}`;
    const request = this.magicBookAPI.dispatcher.add(path);
    const res = await this.magicBookAPI.fetcher.call<ProjectAutofillResponse>({
      path,
      options: {
        method: "GET",
        headers: {
          "magic-request-id": request.id,
        },
      },
      factory: async () => {
        return {
          options: optionsFactory(),
          requestId: faker.string.ulid(),
        } as ProjectAutofillResponse;
      },
    });

    request.addEvent("fetch", path);

    return optionsSchema.parse(formatObject(res.options, { snakeToCamelCase: true }));
  }

  async restyle(body: Project) {
    const path = "/designer/projects/restyle";
    const request = this.magicBookAPI.dispatcher.add(path, {
      finalEventName: "surfaces.designed",
      timeoutEventName: "surfaces.designedTimeout",
    });
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
        Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
          eventHandler([surfaceFactory()], "surfaces.designed");
        });
        return simpleResponseFactory();
      },
    });

    request.addEvent("fetch", path);

    return res;
  }

  async resize(body: Project) {
    const path = "/designer/projects/resize";
    const request = this.magicBookAPI.dispatcher.add(path, {
      finalEventName: "surfaces.designed",
      timeoutEventName: "surfaces.designedTimeout",
    });
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
        Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
          eventHandler([surfaceFactory()], "surfaces.designed");
        });
        return simpleResponseFactory();
      },
    });

    request.addEvent("fetch", path);

    return res;
  }
}
