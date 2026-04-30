import {
  maxReconnectionAttempts,
  wsForceCloseGracePeriod,
  wsHeartbeatInterval,
  wsPongTimeout,
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
  private maxReconnectionAttemptsReached = false;
  private manuallyClosed = false;
  private heartbeatTimer?: ReturnType<typeof setTimeout>;
  private pongTimer?: ReturnType<typeof setTimeout>;
  private forceCloseTimer?: ReturnType<typeof setTimeout>;
  private ttlTimer?: ReturnType<typeof setTimeout>;

  constructor(url: string, onConnectionStateChange: () => void, dispatcher: Dispatcher) {
    this.url = url;
    this.connect();
    this.onConnectionStateChange = onConnectionStateChange;
    this.dispatcher = dispatcher;
  }

  async connect({ manual = false }: { manual?: boolean } = {}): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.connection?.readyState === WebSocket.CONNECTING) {
        return resolve(false);
      }
      if (this.connection?.readyState === WebSocket.OPEN) {
        return resolve(true);
      }

      if (this.maxReconnectionAttemptsReached) {
        this.reconnectionAttempts = 0;
        this.maxReconnectionAttemptsReached = false;
      }
      this.manuallyClosed = false;

      this.connection = new WebSocket(this.url);

      this.connection.onopen = () => {
        this.reconnectionAttempts = 0;
        this.maxReconnectionAttemptsReached = false;
        this.startHeartbeat();
        this.startTtlTimer();
        this.onConnectionStateChange();
        resolve(true);
      };

      this.connection.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data?.result === "pong") {
          this.handlePong();
          return;
        }
        const res = formatObject(data, {
          snakeToCamelCase: true,
        }) as WSMessage;
        const dispatcherEvent = this.dispatcher.getById(res.requestId);
        dispatcherEvent?.addEvent("ws", res.eventName, res);
      };

      this.connection.onclose = () => {
        this.handleClose();
        if (this.manuallyClosed) {
          resolve(false);
          return;
        }
        // Manual attempts don't fall back to the auto-retry budget — one shot, then report.
        if (manual) {
          this.maxReconnectionAttemptsReached = true;
          this.onConnectionStateChange();
          resolve(false);
          return;
        }
        if (this.reconnectionAttempts < maxReconnectionAttempts) {
          setTimeout(() => {
            this.connect();
            this.reconnectionAttempts++;
          }, wsReconnectInterval * this.reconnectionAttempts);
        } else {
          this.maxReconnectionAttemptsReached = true;
          this.onConnectionStateChange();
          resolve(false);
        }
      };
    });
  }

  disconnect() {
    this.manuallyClosed = true;
    this.reconnectionAttempts = 0;
    this.maxReconnectionAttemptsReached = false;
    const connection = this.connection;
    if (!connection) {
      this.handleClose();
      return;
    }
    if (connection.readyState === WebSocket.CLOSED) {
      this.handleClose();
      return;
    }
    try {
      connection.close();
    } catch {
      // ignore — fall through to the synthetic close below
    }
    // Mirror the stalled-socket guard from handlePongTimeout: ensure onclose runs.
    if (connection.readyState !== WebSocket.CLOSED && connection.onclose) {
      const onclose = connection.onclose;
      connection.onclose = null;
      onclose.call(connection, new CloseEvent("close"));
    }
  }

  isConnectionOpen() {
    return this.connection?.readyState === WebSocket.OPEN;
  }

  hasReachedMaxReconnectionAttempts() {
    return this.maxReconnectionAttemptsReached;
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.scheduleNextPing();
  }

  private scheduleNextPing() {
    this.heartbeatTimer = setTimeout(() => {
      if (this.connection?.readyState !== WebSocket.OPEN) {
        return;
      }
      this.connection.send(JSON.stringify({ action: "ping" }));
      this.pongTimer = setTimeout(() => {
        this.handlePongTimeout();
      }, wsPongTimeout);
    }, wsHeartbeatInterval);
  }

  private handlePong() {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = undefined;
    }
    if (this.connection?.readyState === WebSocket.OPEN) {
      this.scheduleNextPing();
    }
  }

  private handlePongTimeout() {
    this.pongTimer = undefined;
    const connection = this.connection;
    if (!connection) return;
    // Once max attempts is reached we should not try to revive the connection.
    if (this.reconnectionAttempts >= maxReconnectionAttempts) {
      return;
    }
    try {
      connection.close();
    } catch {
      // ignore — we will force the close handler below
    }
    // Browsers don't always fire onclose promptly on a stalled socket; ensure it runs.
    this.forceCloseTimer = setTimeout(() => {
      this.forceCloseTimer = undefined;
      if (connection.onclose) {
        const onclose = connection.onclose;
        connection.onclose = null;
        onclose.call(connection, new CloseEvent("close"));
      }
    }, wsForceCloseGracePeriod);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = undefined;
    }
    if (this.forceCloseTimer) {
      clearTimeout(this.forceCloseTimer);
      this.forceCloseTimer = undefined;
    }
  }

  private handleClose() {
    this.stopHeartbeat();
    this.stopTtlTimer();
    this.onConnectionStateChange();
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
