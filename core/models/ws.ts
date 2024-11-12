import type { MBEvent } from "./event";

type WSMessage = {
  event_name: string;
  result: unknown;
  request: {
    client_id: string;
    url: string;
    [key: string]: unknown;
  };
};

export class WS {
  private connection?: WebSocket;
  private url: string;
  private reconnectInterval = 5000;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.connection = new WebSocket(this.url);

    this.connection.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.connection.onmessage = (event: MessageEvent) => {
      const { result, request, event_name } = JSON.parse(event.data) as WSMessage;
      const customEvent = new CustomEvent<MBEvent<unknown>>("MagicBook", {
        detail: {
          eventName: event_name,
          request,
          result,
        },
      });
      window.dispatchEvent(customEvent);
    };

    this.connection.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.connection.onclose = () => {
      console.log("WebSocket connection closed, attempting to reconnect...");
      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  isOpen() {
    return this.connection?.readyState === 1;
  }
}
