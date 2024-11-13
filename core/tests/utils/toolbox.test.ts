import { handleAsyncFunction, mergeNestedObject } from "@/core/utils/toolbox";
import { describe, expect, test } from "vitest";

describe("Toolbox", () => {
  test("should merge two flat objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });
  test("should deeply merge nested objects", () => {
    const obj1 = { a: { x: 1 }, b: 2 };
    const obj2 = { a: { y: 2 }, b: 3 };
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 3 });
  });
  test("should handle arrays by copying them", () => {
    const obj1 = { a: [1, 2, 3] };
    const obj2 = { a: [4, 5] };
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: [4, 5] });
  });
  test("should handle objects with null values", () => {
    const obj1 = { a: null, b: 2 };
    const obj2 = { a: { x: 1 }, b: 3 };
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: { x: 1 }, b: 3 });
  });
  test("should handle merging when objToMerge is empty", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = {};
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 2 });
  });
  test("should handle merging when obj is empty", () => {
    const obj1 = {};
    const obj2 = { a: 1, b: 2 };
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 2 });
  });
  test("should merge complex nested structures", () => {
    const obj1 = { a: { b: { c: 1 } }, d: 4 };
    const obj2 = { a: { b: { e: 2 } }, f: 5 };
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: { b: { c: 1, e: 2 } }, d: 4, f: 5 });
  });
  test("should not mutate the original objects", () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const result = mergeNestedObject(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(obj1).toEqual({ a: 1 });
    expect(obj2).toEqual({ b: 2 });
  });
  test("handleAsyncFunction succeed", async () => {
    const res = await handleAsyncFunction(async () => new Promise((resolve) => resolve("success")));
    expect(res).toBe("success");
  });
  test.fails("handleAsyncFunction fails", async () => {
    const res = await handleAsyncFunction(async () => {
      throw new Error("error");
    });
    expect(res).toThrowError("error");
  });
});
