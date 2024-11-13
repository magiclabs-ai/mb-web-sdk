export const defaultApiHost: string = process.env.API_HOST || "localhost:2812";
export const wsReconnectInterval: number = process.env.WS_RECONNECT_INTERVAL
  ? Number.parseInt(process.env.WS_RECONNECT_INTERVAL)
  : 5000;
