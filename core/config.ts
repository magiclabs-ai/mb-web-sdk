export const defaultApiHost: string = process.env.API_HOST || "api.prod.xyz.io";
export const wsReconnectInterval: number = process.env.WS_RECONNECT_INTERVAL
  ? Number.parseInt(process.env.WS_RECONNECT_INTERVAL)
  : 5000;
