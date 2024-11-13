import { wsReconnectInterval } from "../config";
import { snakeCaseObjectKeysToCamelCase } from "../utils/toolbox";
import type { MBEvent } from "./event";

type WSMessage = {
  eventName: string;
  result: unknown;
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

  constructor(url: string, onConnectionOpened: () => void) {
    this.url = url;
    this.connect();
    this.onConnectionOpened = onConnectionOpened;
  }

  private connect() {
    this.connection = new WebSocket(this.url);

    this.connection.onopen = () => {
      this.onConnectionOpened();
    };

    this.connection.onmessage = (event: MessageEvent) => {
      const { result, request, eventName } = snakeCaseObjectKeysToCamelCase(JSON.parse(event.data)) as WSMessage;
      const customEvent = new CustomEvent<MBEvent<unknown>>("MagicBook", {
        detail: {
          eventName,
          request,
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
