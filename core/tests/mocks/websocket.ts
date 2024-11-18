import { vi } from "vitest";

export class WebSocketMock {
  onclose: (() => void) | undefined;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onmessage: ((event: MessageEvent<any>) => void) | undefined;

  readyState: number;

  constructor(url: string | URL) {
    setTimeout(() => {
      this.test();
    }, 100);
  }

  async test() {
    this.readyState = 1;
    if (this.onopen) this.onopen();
  }

  onopen: (() => void) | undefined;

  close() {
    if (this.onclose) this.onclose();
  }
}

vi.stubGlobal("WebSocket", WebSocketMock);
