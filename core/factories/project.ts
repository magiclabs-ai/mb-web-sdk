import { faker } from "@faker-js/faker";
import { photoFactory } from "@/core/factories/photo";
import { surfaceFactory } from "@/core/factories/surface";
import type { Project } from "@/core/models/project";
import type { ProjectAutofillBody } from "@/core/models/api/endpoints/projects";

type ProjectFactoryProps = Partial<(ProjectAutofillBody | Project) & { noSurfaces?: boolean }>;
export function projectFactory(props?: ProjectFactoryProps): Project {
  return {
    designMode: "automatic",
    occasion: "birthday",
    style: "modern",
    imageFilteringLevel: "best",
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
    surfaces: props?.noSurfaces ? [] : Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, surfaceFactory),
    images: props?.images || Array.from({ length: faker.number.int({ min: 10, max: 100 }) }, photoFactory),
  };
}
