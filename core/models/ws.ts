import {
  maxReconnectionAttempts,
  wsHeartbeatInterval,
  wsReconnectInterval,
  wsTtlRefreshInterval,
} from "../config";
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
  private heartbeatTimer?: ReturnType<typeof setInterval>;
  private ttlTimer?: ReturnType<typeof setTimeout>;

  constructor(url: string, onConnectionStateChange: () => void, dispatcher: Dispatcher) {
    this.url = url;
    this.connect();
    this.onConnectionStateChange = onConnectionStateChange;
    this.dispatcher = dispatcher;
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.connection?.readyState === WebSocket.CONNECTING) {
        return resolve(false);
      }
      if (this.connection?.readyState === WebSocket.OPEN) {
        return resolve(true);
      }

      this.connection = new WebSocket(this.url);

      this.connection.onopen = () => {
        this.reconnectionAttempts = 0;
        this.startHeartbeat();
        this.startTtlTimer();
        this.onConnectionStateChange();
        resolve(true);
      };

      this.connection.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data?.result === "pong") {
          return;
        }
        const res = formatObject(data, {
          snakeToCamelCase: true,
        }) as WSMessage;
        const dispatcherEvent = this.dispatcher.getById(res.requestId);
        dispatcherEvent?.addEvent("ws", res.eventName, res);
      };

      this.connection.onclose = () => {
        this.stopHeartbeat();
        this.stopTtlTimer();
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

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.connection?.readyState === WebSocket.OPEN) {
        this.connection.send(JSON.stringify({ action: "ping" }));
      }
    }, wsHeartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private startTtlTimer() {
    this.stopTtlTimer();
    this.ttlTimer = setTimeout(() => {
      this.connection?.close();
    }, wsTtlRefreshInterval);
  }

  private stopTtlTimer() {
    if (this.ttlTimer) {
      clearTimeout(this.ttlTimer);
      this.ttlTimer = undefined;
    }
  }
}
