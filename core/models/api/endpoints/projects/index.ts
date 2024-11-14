import type { Project, ProjectAutofillBody } from "@/core/models/project";
import type { MagicBookAPI } from "../..";
import { camelCaseObjectKeysToSnakeCase, handleAsyncFunction } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import { surfaceFactory } from "@/core/factories/surface";
import { faker } from "@faker-js/faker";
import { projectFactory } from "@/core/factories/project";

export class ProjectEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  autofill(body: ProjectAutofillBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/designer/projects/autofill",
        options: {
          method: "POST",
          body: JSON.stringify(camelCaseObjectKeysToSnakeCase(body)),
        },
        factory: async () => {
          Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, () =>
            eventHandler([surfaceFactory()], "project.autofilled"),
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
        path: "/designer/projects/resize",
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
