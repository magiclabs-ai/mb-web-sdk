import type { WSMessage } from "@/core/models/dispatcher";

export async function eventHandler<T>(detail: T, eventName: string, noRequest = false) {
  const customEvent = new CustomEvent<WSMessage<T>>("MagicBook", {
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
