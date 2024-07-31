import { SurfaceEndpoints } from "./endpoints/surface";
import { Fetcher } from "../fetcher";
import { AutofillOptionsEndpoints } from "@/core/models/api/endpoints/autofill-options";
import { defaultApiHost } from "@/core/config";
import { ProjectEndpoints } from "@/core/models/api/endpoints/project";
import { PhotoEndpoints } from "@/core/models/api/endpoints/photo";

type MagicBookAPIProps = {
  apiKey: string;
  apiHost?: string;
  webSocketHost?: string;
  mock?: boolean;
};

export class MagicBookAPI {
  readonly fetcher: Fetcher;

  constructor({ apiHost = defaultApiHost, apiKey, mock = false }: MagicBookAPIProps) {
    const options = {
      headers: {
        Authorization: `API-Key ${apiKey}`,
      },
    };
    this.fetcher = new Fetcher(apiHost, options, mock);
  }

  readonly surface = new SurfaceEndpoints(this);
  readonly project = new ProjectEndpoints(this);
  readonly autofillOptions = new AutofillOptionsEndpoints(this);
  readonly photo = new PhotoEndpoints(this);
}
