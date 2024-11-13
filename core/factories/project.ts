import { metadataFactory } from "@/core/factories/metadata";
import { photoFactory } from "@/core/factories/photo";
import { surfaceFactory } from "@/core/factories/surface";
import type { Project, ProjectAutofillBody } from "@/core/models/project";
import { faker } from "@faker-js/faker";

export function projectFactory(props?: (ProjectAutofillBody | Project) & { noSurfaces?: boolean }): Project {
  return {
    // id: Object.hasOwn(props || {}, "id") ? (props as Project).id : faker.string.uuid(),
    surfaces: props?.noSurfaces ? [] : Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, surfaceFactory),
    metadata: props?.metadata || Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, metadataFactory),
    photos: props?.photos || Array.from({ length: faker.number.int({ min: 10, max: 100 }) }, photoFactory),
  };
}
