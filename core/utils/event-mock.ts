import type { MBEvent } from "@/core/models/event";

export async function eventHandler<T>(detail: T, eventName: string, noRequest = false) {
  const customEvent = new CustomEvent<MBEvent<T>>("MagicBook", {
    detail: {
      eventName,
      request: {
        client_id: "mock",
        url: "mock",
      },
      result: detail,
    },
  });
  if (noRequest) {
    customEvent.detail.request = undefined;
  }
  new Promise(() => {
    setTimeout(() => {
      window.dispatchEvent(customEvent);
    }, 500);
  });
  return {};
}
