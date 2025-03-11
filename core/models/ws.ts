import { wsReconnectInterval } from "../config";
import { photoIdConverter, snakeCaseObjectKeysToCamelCase } from "../utils/toolbox";
import type { MBEvent } from "./event";
import type { Logger } from "./logger";

const endEvents = ["photos.analyzed", "surfaces.designed"];

type WSMessage = {
  eventType?: string;
  eventName: string;
  result: unknown;
  requestId: string;
  request: {
    clientId: string;
    url: string;
    [key: string]: unknown;
  };
};

export class WS {
  connection?: WebSocket;
  private url: string;
  private onConnectionOpened: () => void;
  private useIntAsPhotoId: boolean;
  private logger?: Logger;

  constructor(url: string, onConnectionOpened: () => void, useIntAsPhotoId: boolean, logger?: Logger) {
    this.url = url;
    this.connect();
    this.onConnectionOpened = onConnectionOpened;
    this.useIntAsPhotoId = useIntAsPhotoId;
    this.logger = logger;
  }

  private connect() {
    this.connection = new WebSocket(this.url);

    this.connection.onopen = () => {
      this.onConnectionOpened();
    };

    this.connection.onmessage = (event: MessageEvent) => {
      const { result, ...rest } = snakeCaseObjectKeysToCamelCase(JSON.parse(event.data)) as WSMessage;
      result && this.useIntAsPhotoId && photoIdConverter(result, "response");

      const log = this.logger?.getById(rest.requestId);
      log?.addSubProcess("ws", rest.eventName);

      if (endEvents.includes(rest.eventName)) {
        log?.finish();
      }

      const customEvent = new CustomEvent<MBEvent<unknown>>("MagicBook", {
        detail: {
          ...rest,
          result,
        },
      });
      window.dispatchEvent(customEvent);
    };

    this.connection.onclose = () => {
      setTimeout(() => this.connect(), wsReconnectInterval);
    };
  }

  isConnectionOpen() {
    return this.connection?.readyState === 1;
  }
}
