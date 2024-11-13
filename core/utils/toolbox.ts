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

export function camelCaseObjectKeysToSnakeCase(camelCaseObject: Record<string, unknown>, excludeKeys: string[] = []) {
  Object.keys(camelCaseObject).map((key) => {
    const snakeCaseKey = camelCaseToSnakeCase(key);
    if (snakeCaseKey.includes("_")) {
      camelCaseObject[snakeCaseKey] = camelCaseObject[key];
      delete camelCaseObject[key];
    }
    if (typeof camelCaseObject[snakeCaseKey] === "object" && camelCaseObject[snakeCaseKey] !== null) {
      camelCaseObject[snakeCaseKey] = camelCaseObjectKeysToSnakeCase(
        camelCaseObject[snakeCaseKey] as Record<string, unknown>,
        excludeKeys,
      );
    }
  });
  return camelCaseObject;
}

export function snakeCaseToCamelCase(str: string) {
  return str.replace(/([-_][a-z])/g, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));
}
export function snakeCaseObjectKeysToCamelCase(
  snakeCaseObject: Record<string, unknown>,
  excludeKeys: string[] = [],
): Record<string, unknown> {
  for (const key of Object.keys(snakeCaseObject)) {
    if (excludeKeys.includes(key)) {
      continue;
    }

    const camelCaseKey = snakeCaseToCamelCase(key);
    if (camelCaseKey !== key) {
      snakeCaseObject[camelCaseKey] = snakeCaseObject[key];
      delete snakeCaseObject[key];
    }

    if (typeof snakeCaseObject[camelCaseKey] === "object" && snakeCaseObject[camelCaseKey] !== null) {
      snakeCaseObject[camelCaseKey] = snakeCaseObjectKeysToCamelCase(
        snakeCaseObject[camelCaseKey] as Record<string, unknown>,
        excludeKeys,
      );
    }
  }
  return snakeCaseObject;
}
