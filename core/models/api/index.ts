import { Fetcher, type FetchOptions } from "../fetcher";
import { defaultApiHost } from "@/core/config";
import { ProjectEndpoints } from "@/core/models/api/endpoints/projects";
import { PhotoEndpoints } from "@/core/models/api/endpoints/photos";
import { WS } from "../ws";
import { faker } from "@faker-js/faker";
import { SurfaceEndpoints } from "@/core/models/api/endpoints/surfaces";
import { formatObject } from "@/core/utils/toolbox";
import { Dispatcher, type WSMessage } from "../dispatcher";
import { z } from "zod/v4";
import { densitiesFactory } from "@/core/factories/design-options";
import { StyleEndpoints } from "@/core/models/api/endpoints/styles";

export type WSConnectionState = {
  areConnectionsOpen: boolean;
};

const densitySchema = z.object({
  minImageCount: z.number(),
  avgImageCount: z.number(),
  maxImageCount: z.number(),
  minPageCount: z.number(),
  maxPageCount: z.number(),
});

export const densitiesSchema = z.object({
  low: densitySchema,
  medium: densitySchema,
  high: densitySchema,
});

export type DesignOptionsDensitiesResponse = {
  densities: z.infer<typeof densitiesSchema>;
};

type MagicBookAPIProps = {
  debugMode?: boolean;
} & (
  | {
      apiKey: string;
      apiHost?: string;
      mock?: false;
    }
  | {
      apiKey?: string;
      apiHost?: string;
      mock: true;
    }
);

export class MagicBookAPI {
  private clientId = faker.string.uuid();
  analyzerWS?: WS;
  designerWS?: WS;
  readonly fetcher: Fetcher;
  dispatcher: Dispatcher;

  constructor(props: MagicBookAPIProps) {
    const host = props.apiHost || defaultApiHost;
    const isProd = host.includes(".prod.");
    const debugMode = props.debugMode || (props.debugMode === undefined && !isProd);
    this.dispatcher = new Dispatcher(debugMode);
    const apiHost = `https://${host}`;
    const webSocketHost = `wss://${host}`;
    const mock = props.mock ?? false;
    const options = {
      headers: {
        "magic-client-id": this.clientId,
      },
    } as FetchOptions;

    if (!mock) {
      options.headers.Authorization = `Api-key ${props.apiKey}`;
      this.analyzerWS = new WS(
        `${webSocketHost}/ws/analyzer?clientId=${this.clientId}`,
        () => this.onConnectionStateChange(),
        this.dispatcher,
      );
      this.designerWS = new WS(
        `${webSocketHost}/ws/designer?clientId=${this.clientId}`,
        () => this.onConnectionStateChange(),
        this.dispatcher,
      );
    }

    this.fetcher = new Fetcher(apiHost, options, mock, () => this.areWSOpen());
  }

  areWSOpen() {
    return (this.analyzerWS?.isConnectionOpen() && this.designerWS?.isConnectionOpen()) ?? false;
  }

  async reconnectWS(): Promise<WSConnectionState> {
    await Promise.all([this.analyzerWS?.connect(), this.designerWS?.connect()]);
    return { areConnectionsOpen: this.areWSOpen() };
  }

  onConnectionStateChange() {
    const onConnectionStateChangeEvent = new CustomEvent<WSMessage<WSConnectionState>>("MagicBook", {
      detail: { eventName: "ws", result: { areConnectionsOpen: this.areWSOpen() } },
    });
    window.dispatchEvent(onConnectionStateChangeEvent);
  }

  bodyParse(obj: unknown) {
    return JSON.stringify(
      formatObject(obj, {
        camelToSnakeCase: true,
      }),
    );
  }

  readonly photos = new PhotoEndpoints(this);
  readonly projects = new ProjectEndpoints(this);
  readonly surfaces = new SurfaceEndpoints(this);
  readonly styles = new StyleEndpoints(this);

  async imageDensities(sku: string, imageCount: number, imageFilteringLevel: string) {
    const path = `mmb/v1/designoptions/sku/${sku}/imagecount/${imageCount}/imagefilteringlevel/${imageFilteringLevel}/`;
    const request = this.dispatcher.add(path);

    try {
      const res = await this.fetcher.call<DesignOptionsDensitiesResponse>({
        path,
        options: {
          method: "GET",
        },
        factory: async () => {
          return densitiesFactory();
        },
      });
      request.addEvent("fetch", path);
      return densitiesSchema.parse(res.densities);
    } catch (error) {
      request.addEvent("fetch", path);
      throw error;
    }
  }
}
