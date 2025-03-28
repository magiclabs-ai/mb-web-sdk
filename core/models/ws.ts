import { wsReconnectInterval } from "../config";
import { photoIdConverter, snakeCaseObjectKeysToCamelCase } from "../utils/toolbox";
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
      const { result, ...rest } = snakeCaseObjectKeysToCamelCase(JSON.parse(event.data)) as WSMessage;
      result && this.useIntAsPhotoId && photoIdConverter(result, "response");
      const dispatcherEvent = this.dispatcher.getById(rest.requestId);
      dispatcherEvent?.addEvent("ws", rest.eventName, { ...rest, result });
    };

    this.connection.onclose = () => {
      setTimeout(() => this.connect(), wsReconnectInterval);
    };
  }

  isConnectionOpen() {
    return this.connection?.readyState === 1;
  }
}
