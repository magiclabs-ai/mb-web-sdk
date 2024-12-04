import type { Project, projectAutofillBodySchema } from "@/core/models/project";
import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import { surfaceFactory } from "@/core/factories/surface";
import { faker } from "@faker-js/faker";
import type { z } from "zod";
import { makeMyBookSchema } from "@/core/models/mmb";

export type ProjectAutofillBody = z.infer<typeof projectAutofillBodySchema>;
export type MakeMyBookBody = z.infer<typeof makeMyBookSchema>;

export class ProjectEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

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

  makeMyBook(body: MakeMyBookBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/projects/makemybook",
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
