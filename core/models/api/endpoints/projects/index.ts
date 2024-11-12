import type { Project, ProjectAutofillBody } from "@/core/models/project";
import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import { projectFactory } from "@/core/factories/project";
import { surfaceFactory } from "@/core/factories/surface";
import { faker } from "@faker-js/faker";

export class ProjectEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  autofill(body: ProjectAutofillBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/projects/autofill",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => {
          eventHandler(await projectFactory({ ...body, noSurfaces: true }), "projects.autofill");
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler(await surfaceFactory(), "projects.autofill.surface");
          });
          return {};
        },
      });
      return res;
    });
  }

  restyle(body: Project) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/projects/restyle",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => {
          eventHandler(await projectFactory({ ...body, noSurfaces: true }), "projects.restyle");
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler(await surfaceFactory(), "projects.restyle.surface");
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
        path: "/v1/projects/resize",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => {
          eventHandler(
            await projectFactory({
              ...body,
              noSurfaces: true,
            }),
            "projects.resize",
          );
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler(await surfaceFactory(), "projects.resize.surface");
          });
          return {};
        },
      });
      return res;
    });
  }
}
