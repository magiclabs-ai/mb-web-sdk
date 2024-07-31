import { AutofillOptionsFactory } from "@/core/factories/autofill-options";
import type { MagicBookAPI } from "..";
import { handleAsyncFunction } from "@/core/utils/toolbox";

export class AutofillOptionsEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  retrieve(imageCount?: number) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: `/v1/autofilloptions${imageCount ? `?imageCount=${imageCount}` : ""}`,
        factory: AutofillOptionsFactory,
      });
      return res;
    });
  }
}
