import type { MagicBookAPI } from "../..";
import { eventHandler } from "@/core/utils/event-mock";
import { photoFactory } from "@/core/factories/photo";
import type { PhotoAnalyzeBody } from "@/core/models/photo";
import type { RequestResponse } from "@/core/models/fetcher";
import { simpleResponseFactory } from "@/core/factories/response";

export class PhotoEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async analyze(body: PhotoAnalyzeBody) {
    const path = "/analyzer/photos/analyze";
    const log = this.magicBookAPI.logger?.add(path);
    const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
      path,
      options: {
        method: "POST",
        body: this.magicBookAPI.bodyParse(body),
      },
      factory: async () => {
        Array.from({ length: body.length }, () => eventHandler(photoFactory(), "photo.analyze"));
        return simpleResponseFactory();
      },
    });
    if (log) {
      log.id = res.requestId as string;
      log.addSubProcess("fetch", path);
    }
    return res;
  }
}
