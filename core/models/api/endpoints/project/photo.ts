import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import type { Project } from "@/core/models/project";
import { projectFactory } from "@/core/factories/project";

export class ProjectSurfacePhotoEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  resize(body: Project) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/surface/photo/resize",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => eventHandler(await projectFactory(), "project.photo.resize"),
      });
      return res;
    });
  }
}
