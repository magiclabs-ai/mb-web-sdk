import { vi } from "vitest";

export class WebSocketMock {
  onclose: (() => void) | undefined;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onmessage: ((event: MessageEvent<any>) => void) | undefined;

  // biome-ignore lint/complexity/noUselessConstructor: <explanation>
  constructor(url: string | URL) {}

  close() {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    this.onclose && this.onclose();
  }
}

vi.stubGlobal("WebSocket", WebSocketMock);
