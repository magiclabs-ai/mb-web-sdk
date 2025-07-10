import type { MagicBookAPI } from "../..";
import { eventHandler } from "@/core/utils/event-mock";
import { photoFactory } from "@/core/factories/photo";
import type { AnalyzedPhoto, PhotoAnalyzeBody } from "@/core/models/photo";
import type { RequestResponse } from "@/core/models/fetcher";
import { simpleResponseFactory } from "@/core/factories/response";
import type { AddEvent, DispatcherEvent } from "@/core/models/dispatcher";
import { photoDeprecationWarningThreshold } from "@/core/config";

export function photoDeprecationCheck(events: DispatcherEvent[], addEvent: AddEvent, requestId: string) {
  const analyzedPhotos = events
    .filter((event) => event.name === "photo.analyzed" && event.message?.result)
    .map((event) => event.message!.result as AnalyzedPhoto);

  if (!analyzedPhotos.length) return;

  const unselectedCount = analyzedPhotos.filter((photo) => !photo.selected).length;
  const unselectedPercentage = (unselectedCount * 100) / analyzedPhotos.length;

  if (unselectedPercentage > photoDeprecationWarningThreshold) {
    const eventName = "warning.photo-access-deprecated";
    addEvent("ws", eventName, {
      eventName,
      requestId,
    });
  }
}

export class PhotoEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async analyze(body: PhotoAnalyzeBody) {
    const path = "/analyzer/photos/analyze";
    const request = this.magicBookAPI.dispatcher.add(path, {
      finalEventName: "photos.analyzed",
      timeoutEventName: "photos.analyzerTimeout",
      expectedEvents: body.length + 1,
      beforeFinalEvent: photoDeprecationCheck,
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
