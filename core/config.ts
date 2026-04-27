export const defaultApiHost: string = process.env.API_HOST || "api.prod.xyz.io";
export const wsReconnectInterval: number = process.env.WS_RECONNECT_INTERVAL
  ? Number.parseInt(process.env.WS_RECONNECT_INTERVAL)
  : 500;
export const maxReconnectionAttempts: number = process.env.WS_MAX_RECONNECTION_ATTEMPTS
  ? Number.parseInt(process.env.WS_MAX_RECONNECTION_ATTEMPTS)
  : 10;
export const wsHeartbeatInterval: number = process.env.WS_HEARTBEAT_INTERVAL
  ? Number.parseInt(process.env.WS_HEARTBEAT_INTERVAL)
  : 25000;
export const wsPongTimeout: number = process.env.WS_PONG_TIMEOUT
  ? Number.parseInt(process.env.WS_PONG_TIMEOUT)
  : 10000;
export const wsForceCloseGracePeriod: number = process.env.WS_FORCE_CLOSE_GRACE_PERIOD
  ? Number.parseInt(process.env.WS_FORCE_CLOSE_GRACE_PERIOD)
  : 1000;
export const wsTtlRefreshInterval: number = process.env.WS_TTL_REFRESH_INTERVAL
  ? Number.parseInt(process.env.WS_TTL_REFRESH_INTERVAL)
  : 36000000;
export const defaultTimeoutDelay: number = process.env.DEFAULT_TIMEOUT_DELAY
  ? Number.parseInt(process.env.DEFAULT_TIMEOUT_DELAY)
  : 30000;
export const photoDeprecationWarningThreshold: number = process.env.PHOTO_DEPRECATION_WARNING_THRESHOLD
  ? Number.parseInt(process.env.PHOTO_DEPRECATION_WARNING_THRESHOLD)
  : 5;
