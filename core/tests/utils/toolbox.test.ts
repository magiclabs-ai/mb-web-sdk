import { handleAsyncFunction, mergeNestedObject } from "@/core/utils/toolbox";
import { describe, expect, test } from "vitest";

describe("Toolbox", () => {
  test("mergeNestedObject", () => {
    const initialObject = { item: { item: { name: "itemName" } } };
    const objectToMerge = { item: { item: { item: "test" } } };
    expect(mergeNestedObject(initialObject, objectToMerge)).toStrictEqual({
      item: { item: { name: "itemName", item: "test" } },
    });
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
