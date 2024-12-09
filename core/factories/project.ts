import { faker } from "@faker-js/faker";
import { photoFactory } from "@/core/factories/photo";
import { surfaceFactory } from "@/core/factories/surface";
import type { Project, ProjectAutofillBody } from "@/core/models/project";

export function projectFactory(props?: (ProjectAutofillBody | Project) & { noSurfaces?: boolean }): Project {
  return {
    designMode: "automatic",
    occasion: "birthday",
    style: "modern",
    imageDensityLevel: "high",
    embellishmentLevel: "high",
    bookFormat: {
      targetPageRange: [20, 40],
      page: {
        width: 8,
        height: 11,
      },
      cover: {
        width: 8,
        height: 11,
      },
    },
    surfaces: props?.noSurfaces
      ? []
      : Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, surfaceFactory).map((s) => [s]),
    images: props?.images || Array.from({ length: faker.number.int({ min: 10, max: 100 }) }, photoFactory),
  };
}
