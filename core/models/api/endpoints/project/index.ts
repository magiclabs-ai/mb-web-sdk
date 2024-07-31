import type { Project, ProjectAutofillBody } from "@/core/models/project";
import type { MagicBookAPI } from "../..";
import { ProjectSurfacePhotoEndpoints } from "@/core/models/api/endpoints/project/photo";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import { projectFactory } from "@/core/factories/project";
import { surfaceFactory } from "@/core/factories/surface";
import { faker } from "@faker-js/faker";

export class ProjectEndpoints {
  readonly photo: ProjectSurfacePhotoEndpoints;

  constructor(private readonly magicBookAPI: MagicBookAPI) {
    this.photo = new ProjectSurfacePhotoEndpoints(this.magicBookAPI);
  }

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
}
