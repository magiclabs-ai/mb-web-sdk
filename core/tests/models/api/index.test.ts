import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { fetchMocker } from "@/core/tests/mocks/fetch";

describe("API", () => {
  test("apiKey is used properly", async () => {
    const api = new MagicBookAPI({
      apiKey: "fake key",
      mock: true,
    });
    const apiKey = "fake key";
    expect(api.fetcher.options.headers["Authorization"]).toEqual(`API-Key ${apiKey}`);
  });
  test("Without mock", async () => {
    fetchMocker.mockResponse(JSON.stringify({}));

    const api2 = new MagicBookAPI({
      apiKey: "fake key",
    });

    expect(
      await api2.surface.autofill({
        metadata: [],
        photos: [],
      }),
    ).toStrictEqual({});
  });
});
