export async function eventHandler<T>(detail: T, eventName: string) {
  const customEvent = new CustomEvent<T>("MagicBook", { detail: { eventName, payload: detail } });
  new Promise(() => {
    setTimeout(() => {
      window.dispatchEvent(customEvent);
    }, 500);
  });
  return {};
}
