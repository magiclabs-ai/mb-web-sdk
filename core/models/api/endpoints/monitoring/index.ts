import { simpleResponseFactory } from "@/core/factories/response";
import type { MagicBookAPI } from "../..";
import type { RequestResponse } from "@/core/models/fetcher";

export type MonitoringEventsBody = {
  eventName: string;
  eventType: string;
  requestId: string;
  data: {
    timeoutDuration: number;
  };
};

export class MonitoringEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async events(body: MonitoringEventsBody) {
    const path = "/designer/monitoring/events";

    try {
      const res = await this.magicBookAPI.fetcher.call<RequestResponse>({
        path,
        options: {
          method: "POST",
          headers: {
            "magic-request-id": body.requestId,
          },
          body: this.magicBookAPI.bodyParse(body),
        },
        factory: async () => {
          return simpleResponseFactory();
        },
      });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
