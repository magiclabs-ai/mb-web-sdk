import { Fetcher, baseOptions } from "@/core/models/fetcher";
import { describe, expect, test } from "vitest";
import { fetchMocker } from "@/core/tests/mocks/fetch";

describe("Fetcher", () => {
  const fetcher = new Fetcher("https://api.fake-server.com", {}, false, () => true);
  test("init without options", async () => {
    expect(fetcher.options).toStrictEqual(baseOptions);
  });
  test.fails("fail call", async () => {
    fetchMocker.mockReject(() => Promise.reject("Something went wrong. Please try again."));
    const res = await fetcher.call({ path: "/books" });
    expect(res).toThrowError("Something went wrong. Please try again.");
  });
  test.fails("fail call when status code is > 300 with detailed message", async () => {
    fetchMocker.mockResponse(() =>
      Promise.resolve({
        status: 400,
        statusText: "Error 400",
        body: JSON.stringify({
          detail: "Detail error",
        }),
      }),
    );
    const res = await fetcher.call({ path: "/books" });
    expect(res).toThrowError("400 Detail error");
  });
  test.fails("fail call when status code is > 300 with statusText", async () => {
    fetchMocker.mockResponse(() =>
      Promise.resolve({
        status: 400,
        statusText: "Error 400",
      }),
    );
    const res = await fetcher.call({ path: "/books" });
    expect(res).toThrowError("400 Detail error");
  });
  test.fails("fail call when status code is > 300", async () => {
    fetchMocker.mockResponse(
      () =>
        new Promise((resolve) => {
          resolve({
            status: 400,
          });
        }),
    );
    const res = await fetcher.call({ path: "/books" });
    expect(res).toThrowError("Error 400");
  });
  test("body as object", async () => {
    fetchMocker.mockResponse(
      () =>
        new Promise((resolve) => {
          resolve({ status: 200, statusText: "Test" });
        }),
    );
    const res = await fetcher.call({
      path: "/books",
      factory: () => new Promise((resolve) => resolve({})),
      options: {
        method: "POST",
        body: {
          // @ts-ignore
          test: "test",
        },
      },
    });
    expect(res).toStrictEqual({});
  });
});

describe("Fetcher in mock mode", () => {
  const fetcher = new Fetcher("https://api.fake-server.com", {}, true, () => true);
  test("init without options", async () => {
    expect(fetcher.options).toStrictEqual(baseOptions);
  });
  test.fails("mock call", async () => {
    fetchMocker.mockResponse(() => Promise.resolve({}));
    const res = await fetcher.call({ path: "/books" });
    expect(res).toStrictEqual("factory-not-found");
  });
});
