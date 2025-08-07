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

export function msToSeconds(ms: number) {
  return Number((ms / 1000).toFixed(0));
}

export function formatObject(
  obj: unknown,
  options?: {
    camelToSnakeCase?: boolean;
    snakeToCamelCase?: boolean;
    isChild?: boolean;
  },
): unknown {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== "object") return obj;

  const objectToFormat = obj;

  if (Array.isArray(objectToFormat)) {
    return objectToFormat.map((item) => formatObject(item, { ...options, isChild: true })) as unknown[];
  }

  const fObject: Record<string, unknown> = {};

  for (const key in objectToFormat) {
    const value = (objectToFormat as Record<string, unknown>)[key];

    if (value === null || value === undefined) continue;

    let fKey = key;

    if (options?.camelToSnakeCase) {
      fKey = camelCaseToSnakeCase(key);
    } else if (options?.snakeToCamelCase) {
      fKey = snakeCaseToCamelCase(key);
    }

    const fValue = formatObject(value, { ...options, isChild: true });

    fObject[fKey] = fValue;
  }

  return fObject;
}
