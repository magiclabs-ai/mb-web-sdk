import {
  handleAsyncFunction,
  mergeNestedObject,
  camelCaseToSnakeCase,
  camelCaseObjectKeysToSnakeCase,
  photoIdConverter,
  snakeCaseToCamelCase,
  snakeCaseObjectKeysToCamelCase,
} from "@/core/utils/toolbox";
import { describe, expect, test } from "vitest";
import { photoFactory, photoAnalyzeBodyFactory } from "@/core/factories/photo";
import { projectFactory } from "@/core/factories/project";

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
    const camelCaseObject = { helloWorld: "helloWorld", helloWorldTest: "helloWorldTest" };
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
    photoIdConverter(photoAnalyzeBody, "response");
    expect(photoAnalyzeBody.every((photo) => typeof photo.id === "number")).toBe(true);
  });
  test("photoIdConverter convert analyzedPhoto with type response", () => {
    const analyzedPhoto = photoFactory();
    photoIdConverter(analyzedPhoto, "request");
    expect(typeof analyzedPhoto.id === "string").toBe(true);
  });
  test("photoIdConverter convert analyzedPhoto with type response", () => {
    const analyzedPhoto = photoFactory();
    photoIdConverter(analyzedPhoto, "response");
    expect(typeof analyzedPhoto.id === "number").toBe(true);
  });
  test("photoIdConverter convert project with type response", () => {
    const project = projectFactory();
    photoIdConverter(project, "request");
    expect(project.images.every((photo) => typeof photo.id === "string")).toBe(true);
    expect(
      project.surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "string"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert project with type response", () => {
    const project = projectFactory();
    photoIdConverter(project, "response");
    expect(project.images.every((photo) => typeof photo.id === "number")).toBe(true);
    expect(
      project.surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert project with type response and custom layeredItem type", () => {
    const project = projectFactory();
    photoIdConverter(project, "response");
    expect(project.images.every((photo) => typeof photo.id === "number")).toBe(true);
    expect(
      project.surfaces.every((surface) =>
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
      surface: surfaces[0],
    };
    photoIdConverter(surfaceShuffleBody, "request");
    expect(surfaceShuffleBody.images.every((photo) => typeof photo.id === "string")).toBe(true);
    expect(
      surfaceShuffleBody.surface.surfaceData.layeredItems
        .filter((layeredItem) => layeredItem.type === "photo")
        .every((layeredItem) => typeof layeredItem.content.userData.assetId === "string"),
    ).toBe(true);
  });
  test("photoIdConverter convert surfaceShuffleBody with type response", () => {
    const { surfaces, ...project } = projectFactory();
    const surfaceShuffleBody = {
      ...project,
      surface: surfaces[0],
    };
    photoIdConverter(surfaceShuffleBody, "response");
    expect(surfaceShuffleBody.images.every((photo) => typeof photo.id === "number")).toBe(true);
    expect(
      surfaceShuffleBody.surface.surfaceData.layeredItems
        .filter((layeredItem) => layeredItem.type === "photo")
        .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
    ).toBe(true);
  });
  test("photoIdConverter convert projectAutofillBody with type request", () => {
    const projectAutofillBody = projectFactory();
    // biome-ignore lint/performance/noDelete: <explanation>
    delete projectAutofillBody.surfaces;
    photoIdConverter(projectAutofillBody, "request");
    expect(projectAutofillBody.images.every((photo) => typeof photo.id === "string")).toBe(true);
  });
  test("photoIdConverter convert projectAutofillBody with type response", () => {
    const projectAutofillBody = projectFactory();
    // biome-ignore lint/performance/noDelete: <explanation>
    delete projectAutofillBody.surfaces;
    photoIdConverter(projectAutofillBody, "response");
    expect(projectAutofillBody.images.every((photo) => typeof photo.id === "number")).toBe(true);
  });
  test("photoIdConverter convert array of surfaces with type response", () => {
    const surfaces = projectFactory().surfaces;
    photoIdConverter(surfaces, "response");
    expect(
      surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter convert array of surfaces with type response and layeredItem type to text", () => {
    const surfaces = projectFactory().surfaces;
    surfaces[0].surfaceData.layeredItems[0].type = "text";
    photoIdConverter(surfaces, "response");
    expect(
      surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "photo")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "number"),
      ),
    ).toBe(true);
    expect(
      surfaces.every((surface) =>
        surface.surfaceData.layeredItems
          .filter((layeredItem) => layeredItem.type === "text")
          .every((layeredItem) => typeof layeredItem.content.userData.assetId === "string"),
      ),
    ).toBe(true);
  });
  test("photoIdConverter expect to do nothing to non matching schema", () => {
    const obj = { test: "test" };
    photoIdConverter(obj, "response");
    expect(obj).toEqual({ test: "test" });
  });
});
