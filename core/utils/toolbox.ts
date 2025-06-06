import { z } from "zod/v4";
import {
  type AnalyzedPhoto,
  analyzedPhotoSchema,
  type PhotoAnalyzeBody,
  photoAnalyzeBodySchema,
} from "../models/photo";
import { type Project, projectAutofillBodySchema, projectSchema } from "../models/project";
import { type Surface, surfaceSchema } from "../models/surface";
import type { ProjectAutofillBody } from "../models/api/endpoints/projects";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function mergeNestedObject(obj: Record<string, any>, objToMerge: Record<string, any>): Record<string, any> {
  const result = { ...obj };

  for (const [key, value] of Object.entries(objToMerge)) {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        result[key] = [...value];
      } else {
        result[key] = mergeNestedObject(result[key] && typeof result[key] === "object" ? result[key] : {}, value);
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

export async function handleAsyncFunction<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    return Promise.reject(error);
  }
}

export function snakeCaseToCamelCase(str: string): string {
  const regex = /([-_][a-z])/g;
  return str.replace(regex, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));
}

export function camelCaseToSnakeCase(str: string) {
  const regex = /([a-z])([A-Z])/g;
  return str.replace(regex, "$1_$2").toLowerCase();
}

export function parseId(id: string | number, type: "response" | "request"): string | number {
  return type === "request" ? id.toString() : Number.parseInt(id as string);
}

export function photoIdConverter<T>(obj: T, type: "response" | "request") {
  const processPhoto = (photo: { id: string | number }) => {
    return { ...photo, id: parseId(photo.id, type) };
  };

  const processPhotos = (photos: Array<{ id: string | number }>) => {
    return photos.map((photo) => processPhoto(photo));
  };

  const processLayeredItems = (
    layeredItems: Array<{ type: string; content: { userData: { assetId: string | number } } }>,
  ) => {
    return layeredItems.map((layeredItem) => {
      if (layeredItem.type === "photo") {
        return {
          ...layeredItem,
          content: {
            ...layeredItem.content,
            userData: { ...layeredItem.content.userData, assetId: parseId(layeredItem.content.userData.assetId, type) },
          },
        };
      }
      return layeredItem;
    });
  };

  const processSurface = (surface: Surface) => {
    return {
      ...surface,
      surfaceData: { ...surface.surfaceData, layeredItems: processLayeredItems(surface.surfaceData.layeredItems) },
    };
  };

  if (projectSchema.safeParse(obj).success) {
    const project = obj as Project;
    return {
      ...project,
      images: processPhotos(project.images),
      surfaces: project.surfaces.map((surface) => processSurface(surface)),
    };
  }

  if (photoAnalyzeBodySchema.safeParse(obj).success) {
    return processPhotos(obj as PhotoAnalyzeBody);
  }

  if (analyzedPhotoSchema.safeParse(obj).success) {
    return processPhoto(obj as AnalyzedPhoto);
  }

  if (projectAutofillBodySchema.safeParse(obj).success) {
    const project = obj as ProjectAutofillBody;
    return { ...project, images: processPhotos(project.images) };
  }

  if (z.array(surfaceSchema).safeParse(obj).success) {
    return (obj as Array<Surface>).map((surface) => processSurface(surface));
  }

  return obj;
}

export function camelCaseObjectKeysToSnakeCase(
  camelCaseObject: Record<string, unknown> | unknown[],
  excludeKeys: string[] = [],
): Record<string, unknown> | unknown[] {
  if (Array.isArray(camelCaseObject)) {
    return camelCaseObject.map((item) => {
      if (typeof item === "object" && item !== null) {
        return camelCaseObjectKeysToSnakeCase(item as Record<string, unknown>, excludeKeys);
      }
      return item;
    });
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(camelCaseObject as Record<string, unknown>)) {
    const snakeCaseKey = camelCaseToSnakeCase(key);

    if (excludeKeys.includes(key)) {
      result[key] = (camelCaseObject as Record<string, unknown>)[key];
    } else {
      const value = (camelCaseObject as Record<string, unknown>)[key];

      if (typeof value === "object" && value !== null) {
        result[snakeCaseKey] = camelCaseObjectKeysToSnakeCase(value as Record<string, unknown>, excludeKeys);
      } else {
        result[snakeCaseKey] = value;
      }
    }
  }

  return result;
}

export function snakeCaseObjectKeysToCamelCase(
  snakeCaseObject: Record<string, unknown> | unknown[],
  excludeKeys: string[] = [],
): Record<string, unknown> | unknown[] {
  if (Array.isArray(snakeCaseObject)) {
    const resultArray: unknown[] = [];
    for (const item of snakeCaseObject) {
      if (typeof item === "object" && item !== null) {
        resultArray.push(snakeCaseObjectKeysToCamelCase(item as Record<string, unknown>, excludeKeys));
      } else {
        resultArray.push(item);
      }
    }
    return resultArray;
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(snakeCaseObject as Record<string, unknown>)) {
    if (excludeKeys.includes(key)) {
      result[key] = (snakeCaseObject as Record<string, unknown>)[key];
      continue;
    }

    const camelCaseKey = snakeCaseToCamelCase(key);

    const value = (snakeCaseObject as Record<string, unknown>)[key];

    if (typeof value === "object" && value !== null) {
      result[camelCaseKey] = snakeCaseObjectKeysToCamelCase(value as Record<string, unknown>, excludeKeys);
    } else {
      result[camelCaseKey] = value;
    }
  }

  return result;
}

export function removeNullValues<T>(obj: T): T {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeNullValues(item)).filter((item) => item !== null) as T;
  }

  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => [key, typeof value === "object" ? removeNullValues(value) : value]),
  ) as T;
}

export function msFormat(ms: number) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 1000 * 60) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  if (ms < 1000 * 60 * 60) {
    return `${(ms / 1000 / 60).toFixed(2)}m`;
  }
  return `${(ms / 1000 / 60 / 60).toFixed(0)}h`;
}

export function formatObject(
  obj: unknown,
  options: {
    useIntAsPhotoId?: boolean;
    camelToSnakeCase?: boolean;
    snakeToCamelCase?: boolean;
    isChild?: boolean;
  },
): unknown {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== "object") return obj;

  let objectToFormat = obj;

  if (!options.isChild && options.useIntAsPhotoId) {
    objectToFormat = photoIdConverter(obj, "request");
  }

  if (Array.isArray(objectToFormat)) {
    return objectToFormat.map((item) => formatObject(item, { ...options, isChild: true })) as unknown[];
  }

  const fObject: Record<string, unknown> = {};

  for (const key in objectToFormat) {
    const value = (objectToFormat as Record<string, unknown>)[key];

    if (value === null) continue;

    let fKey = key;

    if (options.camelToSnakeCase) {
      fKey = camelCaseToSnakeCase(key);
    } else if (options.snakeToCamelCase) {
      fKey = snakeCaseToCamelCase(key);
    }

    const fValue = formatObject(value, { ...options, isChild: true });

    fObject[fKey] = fValue;
  }

  return fObject;
}
