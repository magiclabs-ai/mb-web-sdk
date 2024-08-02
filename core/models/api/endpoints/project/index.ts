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
        path: "/v1/project/autofill",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => {
          eventHandler(await projectFactory({ ...body, noSurfaces: true }), "project.autofill");
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler(await surfaceFactory(), "project.autofill.surface");
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
        path: "/v1/project/restyle",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => {
          eventHandler(await projectFactory({ ...body, noSurfaces: true }), "project.restyle");
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler(await surfaceFactory(), "project.restyle.surface");
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
        path: "/v1/project/resize",
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
            "project.resize",
          );
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
            eventHandler(await surfaceFactory(), "project.resize.surface");
          });
          return {};
        },
      });
      return res;
    });
  }
}
