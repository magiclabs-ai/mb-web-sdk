import { SurfaceEndpoints } from "./endpoints/surface";
import { Fetcher, type FetchOptions } from "../fetcher";
import { AutofillOptionsEndpoints } from "@/core/models/api/endpoints/autofill-options";
import { defaultApiHost, defaultWebSocketHost } from "@/core/config";
import { ProjectEndpoints } from "@/core/models/api/endpoints/project";
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
  readonly ws?: WS;
  readonly fetcher: Fetcher;

  constructor(props: MagicBookAPIProps) {
    const apiHost = props.apiHost || defaultApiHost;
    const webSocketHost = props.webSocketHost || defaultWebSocketHost;
    const mock = props.mock ?? false;
    const options = {
      headers: {
        "magic-client-id": this.clientId,
      },
    } as FetchOptions;

    if (!mock) {
      if (props.apiKey) options.headers.Authorization = `API-Key ${props.apiKey}`;
      this.ws = new WS(`${webSocketHost}?clientId=${this.clientId}`);
    }

    this.fetcher = new Fetcher(apiHost, options, mock, this.ws);
  }

  readonly surface = new SurfaceEndpoints(this);
  readonly project = new ProjectEndpoints(this);
  readonly autofillOptions = new AutofillOptionsEndpoints(this);
  readonly photos = new PhotoEndpoints(this);
}
