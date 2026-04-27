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

  send = vi.fn();

  // When true, `close()` does not synchronously invoke `onclose` — used to simulate
  // a stalled socket where the browser never fires the close event.
  stallClose = false;

  open() {
    this.readyState = WebSocket.OPEN;
    if (this.onopen) this.onopen();
  }

  onopen: (() => void) | undefined;

  close = vi.fn(function (this: WebSocketMock) {
    this.readyState = WebSocket.CLOSED;
    if (!this.stallClose && this.onclose) this.onclose();
  });
}

vi.stubGlobal("WebSocket", WebSocketMock);
