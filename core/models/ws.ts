import { maxReconnectionAttempts, wsReconnectInterval } from "../config";
import { formatObject, photoIdConverter } from "../utils/toolbox";
import type { Dispatcher } from "./dispatcher";

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
  private dispatcher: Dispatcher;
  private reconnectionAttempts = 0;

  constructor(url: string, onConnectionOpened: () => void, useIntAsPhotoId: boolean, dispatcher: Dispatcher) {
    this.url = url;
    this.connect();
    this.onConnectionOpened = onConnectionOpened;
    this.useIntAsPhotoId = useIntAsPhotoId;
    this.dispatcher = dispatcher;
  }

  private connect() {
    this.connection = new WebSocket(this.url);

    this.connection.onopen = () => {
      this.onConnectionOpened();
    };

    this.connection.onmessage = (event: MessageEvent) => {
      let { result, ...rest } = formatObject(JSON.parse(event.data), {
        snakeToCamelCase: true,
      }) as WSMessage;
      if (result && this.useIntAsPhotoId) {
        result = photoIdConverter(result, "response");
      }
      const dispatcherEvent = this.dispatcher.getById(rest.requestId);
      dispatcherEvent?.addEvent("ws", rest.eventName, { ...rest, result });
    };

    this.connection.onclose = () => {
      if (this.reconnectionAttempts < maxReconnectionAttempts) {
        setTimeout(() => {
          this.connect();
          this.reconnectionAttempts++;
        }, wsReconnectInterval * this.reconnectionAttempts);
      } else {
        throw new Error("ws-failed-to-reconnect");
      }
    };
  }

  isConnectionOpen() {
    return this.connection?.readyState === 1;
  }
}
