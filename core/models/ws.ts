import { maxReconnectionAttempts, wsReconnectInterval } from "../config";
import { formatObject } from "../utils/toolbox";
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
  private dispatcher: Dispatcher;
  private reconnectionAttempts = 0;

  constructor(url: string, onConnectionOpened: () => void, dispatcher: Dispatcher) {
    this.url = url;
    this.connect();
    this.onConnectionOpened = onConnectionOpened;
    this.dispatcher = dispatcher;
  }

  private connect() {
    this.connection = new WebSocket(this.url);

    this.connection.onopen = () => {
      this.onConnectionOpened();
    };

    this.connection.onmessage = (event: MessageEvent) => {
      const res = formatObject(JSON.parse(event.data), {
        snakeToCamelCase: true,
      }) as WSMessage;
      const dispatcherEvent = this.dispatcher.getById(res.requestId);
      dispatcherEvent?.addEvent("ws", res.eventName, res);
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
