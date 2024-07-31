// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function mergeNestedObject(obj: Record<string, any>, objToMerge: Record<string, any>) {
  Object.keys(objToMerge).map((key) => {
    if (typeof obj[key] === "object" && typeof objToMerge[key] === "object") {
      mergeNestedObject(obj[key], objToMerge[key]);
    } else {
      obj[key] = objToMerge[key];
    }
  });
  return obj;
}

export async function handleAsyncFunction<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    return Promise.reject(error);
  }
}
