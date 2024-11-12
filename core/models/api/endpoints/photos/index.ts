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
        path: "/analyzer/v1/photos/analyze",
        options: {
          method: "POST",
          body: JSON.stringify(body),
        },
        factory: async () => {
          Array.from({ length: body.length }, () => eventHandler(photoFactory(), "photos.analyze"));
          return {};
        },
      });
      return res;
    });
  }
}
