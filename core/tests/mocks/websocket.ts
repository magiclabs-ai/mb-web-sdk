import { vi } from "vitest";

export class WebSocketMock {
  static OPEN = 1;
  static CONNECTING = 0;
  static CLOSING = 2;
  static CLOSED = 3;

  onclose: (() => void) | undefined;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onmessage: ((event: MessageEvent<any>) => void) | undefined;

  readyState?: number;

  open() {
    this.readyState = WebSocket.OPEN;
    if (this.onopen) this.onopen();
  }

  onopen: (() => void) | undefined;

  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) this.onclose();
  }
}

vi.stubGlobal("WebSocket", WebSocketMock);
