import { z } from "zod";
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

export function camelCaseToSnakeCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

export function parseId(id: string | number, type: "response" | "request"): string | number {
  return type === "request" ? id.toString() : Number.parseInt(id as string);
}

export function photoIdConverter<T>(obj: T, type: "response" | "request") {
  const processPhotos = (photos: Array<{ id: string | number }>) => {
    for (const photo of photos) {
      photo.id = parseId(photo.id, type);
    }
  };

  const processLayeredItems = (
    layeredItems: Array<{ type: string; content: { userData: { assetId: string | number } } }>,
  ) => {
    for (const layeredItem of layeredItems) {
      if (layeredItem.type === "photo") {
        layeredItem.content.userData.assetId = parseId(layeredItem.content.userData.assetId, type);
      }
    }
  };
  if (photoAnalyzeBodySchema.safeParse(obj).success) {
    processPhotos(obj as PhotoAnalyzeBody);
  } else if (analyzedPhotoSchema.safeParse(obj).success) {
    (obj as AnalyzedPhoto).id = parseId((obj as AnalyzedPhoto).id, type);
  } else if (projectSchema.safeParse(obj).success) {
    const project = obj as Project;
    processPhotos(project.images);
    for (const surface of project.surfaces) {
      processLayeredItems(surface.surfaceData.layeredItems);
    }
  } else if (projectAutofillBodySchema.safeParse(obj).success) {
    const project = obj as ProjectAutofillBody;
    processPhotos(project.images);
  } else if (z.array(surfaceSchema).safeParse(obj).success) {
    const surfaces = obj as Array<Surface>;
    for (const surface of surfaces) {
      processLayeredItems(surface.surfaceData.layeredItems);
    }
  }
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

export function snakeCaseToCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));
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
