import type { WSMessage } from "@/core/models/dispatcher";

export async function eventHandler<T>(detail: T, eventName: string) {
  const customEvent = new CustomEvent<WSMessage<T>>("MagicBook", {
    detail: {
      eventName,
      requestId: "mock",
      eventType: "ws",
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
