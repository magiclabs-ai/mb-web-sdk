import { describe, expect, test } from "vitest";
import { projectSchema } from "@/core/models/project";
import { projectFactory } from "@/core/factories/project";

describe("Project factory", () => {
  test("Without props", async () => {
    expect(projectSchema.parse(projectFactory())).toBeTruthy();
  });
  test("With props", async () => {
    expect(projectSchema.parse(projectFactory())).toBeTruthy();
  });
});
