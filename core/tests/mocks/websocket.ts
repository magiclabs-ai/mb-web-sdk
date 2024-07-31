import {vi} from 'vitest'

export class WebSocketMock {
  onclose: (() => void) | undefined
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onmessage: ((event: MessageEvent<any>) => void) | undefined
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  constructor(url: string|URL){}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close() {
    this.onclose && this.onclose()
  }
}

vi.stubGlobal('WebSocket', WebSocketMock)
