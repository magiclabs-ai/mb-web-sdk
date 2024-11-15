import { describe, expect, test } from "vitest";
import { projectFactory } from "@/core/factories/project";
import { projectSchema } from "@/core/models/project";

describe("Project factory", () => {
  test("Without props", async () => {
    expect(projectSchema.parse(projectFactory())).toBeTruthy();
  });
  test("With props", async () => {
    expect(projectSchema.parse(projectFactory())).toBeTruthy();
  });
});
