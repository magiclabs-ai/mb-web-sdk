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
