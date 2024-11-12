import type { MBEvent } from "@/core/models/event";

export async function eventHandler<T>(detail: T, eventName: string) {
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
  new Promise(() => {
    setTimeout(() => {
      window.dispatchEvent(customEvent);
    }, 500);
  });
  return {};
}
