import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { AutofillOptionsSchema } from "@/core/models/autofill-options";

describe("Autofill Options", () => {
  const api = new MagicBookAPI({
    apiKey: "fake key",
    mock: true,
  });
  test("retrieve", async () => {
    const res = await api.autofillOptions.retrieve();
    expect(AutofillOptionsSchema.parse(res)).toStrictEqual(res);
  });
  test("retrieve with imageCount", async () => {
    const res = await api.autofillOptions.retrieve(10);
    expect(AutofillOptionsSchema.parse(res)).toStrictEqual(res);
  });
});
