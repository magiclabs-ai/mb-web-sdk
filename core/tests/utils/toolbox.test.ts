import {
  handleAsyncFunction,
  mergeNestedObject,
  camelCaseToSnakeCase,
  camelCaseObjectKeysToSnakeCase,
  photoIdConverter,
  snakeCaseToCamelCase,
  snakeCaseObjectKeysToCamelCase,
  msFormat,
  removeNullValues,
} from "@/core/utils/toolbox";
import { describe, expect, test } from "vitest";
import { photoFactory, photoAnalyzeBodyFactory } from "@/core/factories/photo";
import { projectFactory } from "@/core/factories/project";
import type { ProjectAutofillBody } from "@/core/models/api/endpoints/projects";
import type { Surface } from "@/core/models/surface";

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
  test("camelCaseToSnakeCase", () => {
    expect(camelCaseToSnakeCase("helloWorld")).toBe("hello_world");
    expect(camelCaseToSnakeCase("helloWorldTest")).toBe("hello_world_test");
  });
  test("camelCaseObjectKeysToSnakeCase", () => {
    const camelCaseObject = {
      helloWorld: "helloWorld",
      helloWorldTest: "helloWorldTest",
      hello_world_test2: "helloWorldTest2",
    };
    const snakeCaseObject = {
      hello_world: "helloWorld",
      hello_world_test: "helloWorldTest",
      hello_world_test2: "helloWorldTest2",
    };
    expect(camelCaseObjectKeysToSnakeCase(camelCaseObject)).toStrictEqual(snakeCaseObject);
  });
  test("camelCaseObjectKeysToSnakeCase should handle arrays of objects", () => {
    const input = [{ firstName: "John" }, { lastName: "Doe" }];
    const expected = [{ first_name: "John" }, { last_name: "Doe" }];
    expect(camelCaseObjectKeysToSnakeCase(input)).toEqual(expected);
  });
  test("camelCaseObjectKeysToSnakeCase should handle exclude keys", () => {
    const input = { firstName: "John", lastName: "Doe" };
    const expected = { first_name: "John", lastName: "Doe" };
    expect(camelCaseObjectKeysToSnakeCase(input, ["lastName"])).toEqual(expected);
  });
  test("camelCaseObjectKeysToSnakeCase should return the same array if it contains primitive values", () => {
    const input = ["one", "two", "three"];
    const expected = ["one", "two", "three"];
    expect(camelCaseObjectKeysToSnakeCase(input)).toEqual(expected);
  });
  test("snakeCaseToCamelCase", () => {
    expect(snakeCaseToCamelCase("hello_world")).toBe("helloWorld");
    expect(snakeCaseToCamelCase("hello_world_test")).toBe("helloWorldTest");
  });
  test("snakeCaseObjectKeysToCamelCase", () => {
    const snakeCaseObject = {
      hello_world: "helloWorld",
      hello_world_test: "helloWorldTest",
      helloWorldTest2: "helloWorldTest2",
    };
    const camelCaseObject = {
      helloWorld: "helloWorld",
      helloWorldTest: "helloWorldTest",
      helloWorldTest2: "helloWorldTest2",
    };
    expect(snakeCaseObjectKeysToCamelCase(snakeCaseObject)).toStrictEqual(camelCaseObject);
  });
  test("snakeCaseObjectKeysToCamelCase with exclude keys", () => {
    const snakeCaseObject = { hello_world: "helloWorld", hello_world_test: "helloWorldTest" };
    expect(snakeCaseObjectKeysToCamelCase(snakeCaseObject, ["hello_world"])).toStrictEqual({
      hello_world: "helloWorld",
      helloWorldTest: "helloWorldTest",
    });
  });
  test("snakeCaseObjectKeysToCamelCase should handle arrays of objects", () => {
    const input = [{ first_name: "John" }, { last_name: "Doe" }];
    const expected = [{ firstName: "John" }, { lastName: "Doe" }];
    expect(snakeCaseObjectKeysToCamelCase(input)).toEqual(expected);
  });
  test("snakeCaseObjectKeysToCamelCase should return the same array if it contains primitive values", () => {
    const input = ["one", "two", "three"];
    const expected = ["one", "two", "three"];
    expect(snakeCaseObjectKeysToCamelCase(input)).toEqual(expected);
  });
  test("photoIdConverter convert photoAnalyzeBody with type response", () => {
    const photoAnalyzeBody = photoAnalyzeBodyFactory();
    photoIdConverter(photoAnalyzeBody, "request");
    expect(photoAnalyzeBody.every((photo) => typeof photo.id === "string")).toBe(true);
  });
  test("photoIdConverter convert photoAnalyzeBody with type response", () => {
    const photoAnalyzeBody = photoAnalyzeBodyFactory();
    const res = photoIdConverter(photoAnalyzeBody, "response");
    expect(res.every((photo) => typeof photo.id === "number")).toBe(true);
  });
  test("photoIdConverter convert analyzedPhoto with type response", () => {
    const analyzedPhoto = photoFactory();
    const res = photoIdConverter(analyzedPhoto, "request");
    expect(typeof res.id === "string").toBe(true);
  });
  test("photoIdConverter convert analyzedPhoto with type response", () => {
    const analyzedPhoto = photoFactory();
    const res = photoIdConverter(analyzedPhoto, "response");
    expect(typeof res.id === "number").toBe(true);
  });
  test("photoIdConverter convert project with type response", () => {
    const project = projectFactory();
    const res = photoIdConverter(project, "request");
    expect(res.images.every((photo) => typeof photo.id === "string")).toBe(true);
    expect(
      res.surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "string"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert project with type response", () => {
    const project = projectFactory();
    const res = photoIdConverter(project, "response");
    expect(res.images.every((photo) => typeof photo.id === "number")).toBe(true);
    expect(
      res.surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert project with type response and custom layeredItem type", () => {
    const project = projectFactory();
    const res = photoIdConverter(project, "response");
    expect(res.images.every((photo) => typeof photo.id === "number")).toBe(true);
    expect(
      res.surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert surfaceShuffleBody with type request", () => {
    const { surfaces, ...project } = projectFactory();
    const surfaceShuffleBody = {
      ...project,
      surfaces: [surfaces[0]],
    };
    const res = photoIdConverter(surfaceShuffleBody, "request");
    expect(res.images.every((photo) => typeof photo.id === "string")).toBe(true);
    expect(
      res.surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "string"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert surfaceShuffleBody with type response", () => {
    const { surfaces, ...project } = projectFactory();
    const surfaceShuffleBody = {
      ...project,
      surfaces: [surfaces[0]],
    };
    const res = photoIdConverter(surfaceShuffleBody, "response");
    expect(res.images.every((photo) => typeof photo.id === "number")).toBe(true);
    expect(
      res.surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert projectAutofillBody with type request", () => {
    const projectAutofillBody = projectFactory() as ProjectAutofillBody & { surfaces?: Surface[] };
    projectAutofillBody.surfaces = undefined;
    const res = photoIdConverter(projectAutofillBody, "request");
    expect(res.images.every((photo) => typeof photo.id === "string")).toBe(true);
  });
  test("photoIdConverter convert projectAutofillBody with type response", () => {
    const projectAutofillBody = projectFactory() as ProjectAutofillBody & { surfaces?: Surface[] };
    projectAutofillBody.surfaces = undefined;
    const res = photoIdConverter(projectAutofillBody, "response");
    expect(res.images.every((photo) => typeof photo.id === "number")).toBe(true);
  });
  test("photoIdConverter convert array of surfaces with type response", () => {
    const surfaces = projectFactory().surfaces;
    const res = photoIdConverter(surfaces, "response");
    expect(
      res.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert array of surfaces with type response and layeredItem type to text", () => {
    const surfaces = projectFactory().surfaces;
    surfaces[0].surfaceData.layeredItems[0].type = "text";
    const res = photoIdConverter(surfaces, "response");
    expect(
      res.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
    expect(
      res.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "text")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "string"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter expect to do nothing to non matching schema", () => {
    const obj = { test: "test" };
    const res = photoIdConverter(obj, "response");
    expect(res).toEqual({ test: "test" });
  });
  test("msFormat", () => {
    expect(msFormat(100)).toBe("100ms");
    expect(msFormat(1000)).toBe("1.00s");
    expect(msFormat(1000 * 60)).toBe("1.00m");
    expect(msFormat(1000 * 60 * 60)).toBe("1h");
  });
  test("removeNullValues", () => {
    const obj = { a: null, b: 2 };
    const result = removeNullValues(obj);
    expect(result).toEqual({ b: 2 });
  });
  test("removeNullValues should handle arrays", () => {
    const obj = { a: null, b: 2, c: [{ a: null, b: 3 }] };
    const result = removeNullValues(obj);
    expect(result).toEqual({ b: 2, c: [{ b: 3 }] });
  });
});
