import { formatObject, mergeNestedObject } from "../utils/toolbox";

export type FetchOptions = RequestInit & { headers: { Authorization?: string } };

export type RequestResponse = {
  requestId: string;
  clientId?: string;
};

export type CallProps<T> = {
  path: string;
  options?: RequestInit;
  apiKey?: string;
  factory?: () => Promise<T>;
};

export const baseOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
  method: "GET",
};

export class Fetcher {
  baseUrl: URL;
  options: RequestInit;
  mock: boolean;
  areWsOpen: () => boolean;

  constructor(baseUrl: string, options: RequestInit, mock: boolean, areWsOpen: () => boolean) {
    this.baseUrl = new URL(baseUrl);
    this.options = mergeNestedObject(baseOptions, options);
    this.mock = mock;
    this.areWsOpen = areWsOpen;
  }

  async call<T>(props: CallProps<T>): Promise<T> {
    if (this.mock) {
      if (!props.factory) throw Error("factory-not-found");
      return props.factory();
    }

    if (!this.areWsOpen()) {
      throw Error("ws-connection-not-open");
    }

    try {
      if (props.options?.body && typeof props.options.body !== "string") {
        props.options.body = JSON.stringify(props.options?.body);
      }
      const baseOptions = { ...this.options };
      const options = props.options ? mergeNestedObject(baseOptions, props.options) : baseOptions;
      const res = await fetch(this.cleanUrl(new URL(props.path, this.baseUrl).href), options);
      if (res.status >= 200 && res.status < 300) {
        try {
          return formatObject(await res.json(), { snakeToCamelCase: true }) as T;
        } catch (error) {
          return {} as T;
        }
      } else {
        let detail = res.statusText;
        try {
          detail = JSON.stringify((await res.json())?.message);
        } catch (error) {
          /* empty */
        }
        throw Error(`${res.status} ${detail}`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  cleanUrl(url: string) {
    return url.replaceAll(" ", "").trim();
  }
}
