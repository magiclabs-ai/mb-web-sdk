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

    this.connection.onclose = () => {
      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  isOpen() {
    return this.connection?.readyState === 1;
  }
}
