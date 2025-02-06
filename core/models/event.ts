export type MBEvent<T> = {
  eventType?: string;
  eventName: string;
  request?: unknown;
  result: T;
};
