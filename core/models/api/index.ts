import { Fetcher, type FetchOptions } from "../fetcher";
import { defaultApiHost } from "@/core/config";
import { ProjectEndpoints } from "@/core/models/api/endpoints/projects";
import { PhotoEndpoints } from "@/core/models/api/endpoints/photos";
import { WS } from "../ws";
import { faker } from "@faker-js/faker";
import { eventHandler } from "@/core/utils/event-mock";
import { SurfaceEndpoints } from "@/core/models/api/endpoints/surfaces";
import { formatObject } from "@/core/utils/toolbox";
import { Dispatcher } from "../dispatcher";
import { z } from "zod/v4";

const densitySchema = z.object({
  minImageCount: z.number(),
  avgImageCount: z.number(),
  maxImageCount: z.number(),
  minPageCount: z.number(),
  maxPageCount: z.number(),
});

const densitiesSchema = z.object({
  low: densitySchema,
  medium: densitySchema,
  high: densitySchema,
});

type DesignOptionsResponse = {
  densities: z.infer<typeof densitiesSchema>;
};

type MagicBookAPIProps = {
  useIntAsPhotoId?: boolean;
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
  useIntAsPhotoId?: boolean;
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
    this.useIntAsPhotoId = props.useIntAsPhotoId ?? false;

    if (!mock) {
      options.headers.Authorization = `API-Key ${props.apiKey}`;
      this.analyzerWS = new WS(
        `${webSocketHost}/ws/analyzer?clientId=${this.clientId}`,
        () => this.onConnectionOpened(),
        this.useIntAsPhotoId,
        this.dispatcher,
      );
      this.designerWS = new WS(
        `${webSocketHost}/ws/designer?clientId=${this.clientId}`,
        () => this.onConnectionOpened(),
        this.useIntAsPhotoId,
        this.dispatcher,
      );
    }

    this.fetcher = new Fetcher(apiHost, options, mock, () => this.areWSOpen());
  }

  areWSOpen() {
    const isConnectionOpen = (this.analyzerWS?.isConnectionOpen() && this.designerWS?.isConnectionOpen()) ?? false;
    return isConnectionOpen;
  }

  onConnectionOpened() {
    eventHandler({ areConnectionsOpen: this.areWSOpen() }, "ws", true);
  }

  bodyParse(obj: unknown) {
    return JSON.stringify(
      formatObject(obj, {
        useIntAsPhotoId: this.useIntAsPhotoId,
        snakeToCamelCase: true,
      }),
    );
  }

  readonly photos = new PhotoEndpoints(this);
  readonly projects = new ProjectEndpoints(this);
  readonly surfaces = new SurfaceEndpoints(this);

  async imageDensities(sku: string, imageCount: number, imageFilteringLevel: string) {
    const path = `mmb/v1/designoptions/sku/${sku}/imagecount/${imageCount}/imagefilteringlevel/${imageFilteringLevel}/`;
    const dispatcher = this.dispatcher.add(path);
    const res = await this.fetcher.call<DesignOptionsResponse>({
      path,
      options: {
        method: "GET",
      },
      factory: async () => {
        return {
          densities: {
            low: {
              minImageCount: 1,
              avgImageCount: 2,
              maxImageCount: 3,
              minPageCount: 4,
              maxPageCount: 5,
            },
            medium: {
              minImageCount: 1,
              avgImageCount: 2,
              maxImageCount: 3,
              minPageCount: 4,
              maxPageCount: 5,
            },
            high: {
              minImageCount: 1,
              avgImageCount: 2,
              maxImageCount: 3,
              minPageCount: 4,
              maxPageCount: 5,
            },
          },
        } as DesignOptionsResponse;
      },
    });

    dispatcher.id = faker.string.uuid();
    dispatcher.addEvent("fetch", path);

    return densitiesSchema.parse(res.densities);
  }
}
