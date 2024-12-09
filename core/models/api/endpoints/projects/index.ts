import type { Project, projectAutofillBodySchema } from "@/core/models/project";
import type { MagicBookAPI } from "../..";
import type { z } from "zod";
import { handleAsyncFunction, snakeCaseObjectKeysToCamelCase } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import { surfaceFactory } from "@/core/factories/surface";
import { faker } from "@faker-js/faker";
import { optionsFactory } from "@/core/factories/options";
import { optionsSchema } from "@/core/models/options";

export type ProjectAutofillBody = z.infer<typeof projectAutofillBodySchema>;

export class ProjectEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) { }

  autofill(body: ProjectAutofillBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/projects/autofill",
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

  autofillOptions(image_count: number) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: `/designer/projects/autofill/options?image_count=${image_count}`,
        options: {
          method: "GET",
        },
        factory: async () => {
          return optionsFactory();
        },
      });
      return optionsSchema.parse(snakeCaseObjectKeysToCamelCase(res));
    });
  }

  restyle(body: Project) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/projects/restyle",
        options: {
          method: "POST",
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: async () => {
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler([surfaceFactory()], "project.edited");
          });
          return {};
        },
      });
      return res;
    });
  }

  resize(body: Project) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/projects/resize",
        options: {
          method: "POST",
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: async () => {
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler([surfaceFactory()], "project.edited");
          });
          return {};
        },
      });
      return res;
    });
  }
}
