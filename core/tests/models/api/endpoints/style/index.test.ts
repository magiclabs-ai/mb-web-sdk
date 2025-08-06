import { beforeEach, describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { addEventMock, finishMock } from "../../../../mocks/dispatcher";
import { listStylesSchema, styleSchema } from "@/core/models/style";

describe("Style", () => {
  beforeEach(() => {
    addEventMock.mockClear();
    finishMock.mockClear();
  });

  test("list", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });

    const res = await api.styles.list();
    expect(listStylesSchema.parse(res)).toStrictEqual(res);
  });

  test("list with error", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });

    await expect(api.styles.list()).rejects.toThrow();
    expect(addEventMock).toHaveBeenCalled();
  });

  test("retrieve", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });

    const res = await api.styles.retrieve("DG_39651");
    expect(styleSchema.parse(res)).toStrictEqual(res);
  });

  test("retrieve with error", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
    });

    await expect(api.styles.retrieve("DG_39651")).rejects.toThrow();
    expect(addEventMock).toHaveBeenCalled();
  });
});
