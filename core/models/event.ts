export type MBEvent<T> = {
  eventName: string;
  request?: unknown;
  result: T;
};
