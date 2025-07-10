export const defaultApiHost: string = process.env.API_HOST || "api.prod.xyz.io";
export const wsReconnectInterval: number = process.env.WS_RECONNECT_INTERVAL
  ? Number.parseInt(process.env.WS_RECONNECT_INTERVAL)
  : 500;
export const maxReconnectionAttempts: number = process.env.WS_MAX_RECONNECTION_ATTEMPTS
  ? Number.parseInt(process.env.WS_MAX_RECONNECTION_ATTEMPTS)
  : 10;
export const defaultTimeout: number = process.env.DEFAULT_TIMEOUT
  ? Number.parseInt(process.env.DEFAULT_TIMEOUT)
  : 30000;
export const photoDeprecationWarningThreshold: number = process.env.PHOTO_DEPRECATION_WARNING_THRESHOLD
  ? Number.parseInt(process.env.PHOTO_DEPRECATION_WARNING_THRESHOLD)
  : 5;
