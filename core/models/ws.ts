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
  private onConnectionStateChange: () => void;
  private dispatcher: Dispatcher;
  private reconnectionAttempts = 0;

  constructor(url: string, onConnectionStateChange: () => void, dispatcher: Dispatcher) {
    this.url = url;
    this.connect();
    this.onConnectionStateChange = onConnectionStateChange;
    this.dispatcher = dispatcher;
  }

  async connect(): Promise<boolean> {
    if (this.connection?.readyState === WebSocket.CONNECTING) {
      throw new Error("ws-is-already-connecting");
    }

    return new Promise((resolve) => {
      if (this.connection?.readyState === WebSocket.OPEN) {
        return resolve(true);
      }
      
      this.connection = new WebSocket(this.url);

      this.connection.onopen = () => {
        this.onConnectionStateChange();
        resolve(true);
      };

      this.connection.onmessage = (event: MessageEvent) => {
        const res = formatObject(JSON.parse(event.data), {
          snakeToCamelCase: true,
        }) as WSMessage;
        const dispatcherEvent = this.dispatcher.getById(res.requestId);
        dispatcherEvent?.addEvent("ws", res.eventName, res);
      };

      this.connection.onclose = () => {
        this.onConnectionStateChange();
        if (this.reconnectionAttempts < maxReconnectionAttempts) {
          setTimeout(() => {
            this.connect();
            this.reconnectionAttempts++;
          }, wsReconnectInterval * this.reconnectionAttempts);
        } else {
          resolve(false);
        }
      };
    });
  }

  isConnectionOpen() {
    return this.connection?.readyState === WebSocket.OPEN;
  }
}
