import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import { eventHandler } from "@/core/utils/event-mock";
import { photoFactory } from "@/core/factories/photo";
import type { PhotoAnalyzeBody } from "@/core/models/photo";

export class PhotoEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  analyze(body: PhotoAnalyzeBody) {
    return handleAsyncFunction(async () => {
      const res = await this.magicBookAPI.fetcher.call({
        path: "/v1/photo/analyze",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => {
          Array.from({ length: body.length }, () => eventHandler(photoFactory(), "photo.analyze"));
          return {};
        },
      });
      return res;
    });
  }
}
