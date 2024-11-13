// import { SurfaceEndpoints } from "./endpoints/surfaces";
import { Fetcher, type FetchOptions } from "../fetcher";
import { defaultApiHost } from "@/core/config";
import { ProjectEndpoints } from "@/core/models/api/endpoints/projects";
import { PhotoEndpoints } from "@/core/models/api/endpoints/photos";
import { WS } from "../ws";
import { faker } from "@faker-js/faker";
import { eventHandler } from "@/core/utils/event-mock";

type MagicBookAPIProps =
  | {
      apiKey: string;
      apiHost?: string;
      mock?: false;
    }
  | {
      apiKey?: string;
      apiHost?: string;
      mock: true;
    };

export class MagicBookAPI {
  private clientId = faker.string.uuid();
  analyzerWS?: WS;
  designerWS?: WS;
  readonly fetcher: Fetcher;

  constructor(props: MagicBookAPIProps) {
    const host = props.apiHost || defaultApiHost;
    const apiHost = `https://${host}`;
    const webSocketHost = `wss://${host}`;
    const mock = props.mock ?? false;
    const options = {
      headers: {
        "magic-client-id": this.clientId,
      },
    } as FetchOptions;

    if (!mock) {
      options.headers.Authorization = `API-Key ${props.apiKey}`;
      this.analyzerWS = new WS(`${webSocketHost}/ws/analyzer?clientId=${this.clientId}`, () =>
        this.onConnectionOpened(),
      );
      this.designerWS = new WS(`${webSocketHost}/ws/designer?clientId=${this.clientId}`, () =>
        this.onConnectionOpened(),
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

  readonly projects = new ProjectEndpoints(this);
  readonly photos = new PhotoEndpoints(this);
}
