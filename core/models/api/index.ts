import { SurfaceEndpoints } from "./endpoints/surfaces";
import { Fetcher, type FetchOptions } from "../fetcher";
import { AutofillOptionsEndpoints } from "@/core/models/api/endpoints/autofill-options";
import { defaultApiHost } from "@/core/config";
import { ProjectEndpoints } from "@/core/models/api/endpoints/projects";
import { PhotoEndpoints } from "@/core/models/api/endpoints/photos";
import { WS } from "../ws";
import { faker } from "@faker-js/faker";

type MagicBookAPIProps =
  | {
      apiKey: string;
      apiHost?: string;
      webSocketHost?: string;
      mock?: false;
    }
  | {
      apiKey?: string;
      apiHost?: string;
      webSocketHost?: string;
      mock: true;
    };

export class MagicBookAPI {
  private clientId = faker.string.uuid();
  readonly analyzerWS?: WS;
  readonly projectWS?: WS;
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
      this.analyzerWS = new WS(`${webSocketHost}/ws/analyzer?clientId=${this.clientId}`);
      // this.projectWS = new WS(`${webSocketHost}?clientId=${this.clientId}`);
    }

    this.fetcher = new Fetcher(apiHost, options, mock, this.areWSOpen);
  }

  private areWSOpen() {
    return this.analyzerWS?.isOpen();
    // && this.projectWS?.isOpen();
  }

  readonly surfaces = new SurfaceEndpoints(this);
  readonly projects = new ProjectEndpoints(this);
  readonly autofillOptions = new AutofillOptionsEndpoints(this);
  readonly photos = new PhotoEndpoints(this);
}
