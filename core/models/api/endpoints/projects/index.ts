import type { ProjectAutofillBody } from "@/core/models/project";
import type { MagicBookAPI } from "../..";
import { camelCaseObjectKeysToSnakeCase, handleAsyncFunction } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
// import { projectFactory } from "@/core/factories/project";
import { surfaceFactory } from "@/core/factories/surface";
import { faker } from "@faker-js/faker";

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
          eventHandler(
            Array.from({ length: faker.number.int({ max: 10, min: 2 }) }, async () => {
              await surfaceFactory();
            }),
            "project.autofill",
          );

          return {};
        },
      });
      return res;
    });
  }
}
