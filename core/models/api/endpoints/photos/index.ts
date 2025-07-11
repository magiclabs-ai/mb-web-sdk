import type { MagicBookAPI } from "../..";
import { eventHandler } from "@/core/utils/event-mock";
import { photoFactory } from "@/core/factories/photo";
import { photoAnalyzeTimeoutDelay, type PhotoAnalyzeBody, photoDeprecationCheck } from "@/core/models/photo";
import type { RequestResponse } from "@/core/models/fetcher";
import { simpleResponseFactory } from "@/core/factories/response";

export class PhotoEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async analyze(body: PhotoAnalyzeBody) {
    const path = "/analyzer/photos/analyze";
    const request = this.magicBookAPI.dispatcher.add(path, {
      eventType: "photo.analyze",
      expectedEvents: body.length + 1,
      beforeFinalEvent: photoDeprecationCheck,
      finalEventName: "photos.analyzed",
      timeoutEventName: "photos.analyzed-timeout",
      timeoutDelay: photoAnalyzeTimeoutDelay(body.length),
    });

    const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
      path,
      options: {
        method: "POST",
        headers: {
          "magic-request-id": request.id,
        },
        body: this.magicBookAPI.bodyParse(body),
      },
      factory: async () => {
        Array.from({ length: body.length }, () => eventHandler(photoFactory(), "photo.analyze"));
        return simpleResponseFactory();
      },
    });

    request.addEvent("fetch", path);

    return res;
  }
}
