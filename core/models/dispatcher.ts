import { faker } from "@faker-js/faker";
import { defaultTimeout } from "../config";
import { msFormat } from "../utils/toolbox";

type DispatcherEventType = "fetch" | "ws";

export type WSMessage<T> = {
  eventType?: string;
  eventName: string;
  request?: unknown;
  result?: T;
};

export class DispatcherEvent {
  createdAt: number;
  finishedAt?: number;
  name: string;
  type: DispatcherEventType;
  duration?: number;
  message?: WSMessage<unknown>;

  constructor(type: DispatcherEventType, createdAt: number, name: string, message?: WSMessage<unknown>) {
    this.createdAt = createdAt;
    this.finishedAt = Date.now();
    this.type = type;
    this.duration = this.finishedAt - this.createdAt;
    this.name = name;
    this.message = message;
    this.dispatch();
  }

  dispatch() {
    if (!this.message && this.type === "fetch") {
      return;
    }
    const customEvent = new CustomEvent<WSMessage<unknown>>("MagicBook", {
      detail: this.message || {
        eventName: this.name,
      },
    });
    window.dispatchEvent(customEvent);
  }
}

export class Request {
  id: string;
  createdAt: number;
  finishedAt?: number;
  events?: DispatcherEvent[];
  endpoint: string;
  expectedEvents?: number;
  finalEventName?: string;
  timeoutEventName?: string;
  timeout?: NodeJS.Timeout;
  debugMode: boolean;

  constructor(
    endpoint: string,
    config: {
      finalEventName?: string;
      expectedEvents?: number;
      timeoutEventName?: string;
      debugMode: boolean;
    },
  ) {
    // temporary id before receiving the real id from the server
    this.id = faker.string.uuid();
    this.createdAt = Date.now();
    this.endpoint = endpoint;
    this.expectedEvents = config?.expectedEvents;
    this.finalEventName = config?.finalEventName;
    this.timeoutEventName = config?.timeoutEventName;
    this.debugMode = config.debugMode;

    if (this.timeoutEventName) {
      const timeout = defaultTimeout;

      this.timeout = setTimeout(() => {
        this.addEvent("ws", this.timeoutEventName as string, this.finalEventMessage(this.timeoutEventName as string));
        this.addFinalEvent();
      }, timeout);
    }
  }

  finalEventMessage(eventName: string = this.finalEventName as string) {
    return {
      eventName,
      requestId: this.id,
    } as WSMessage<unknown>;
  }

  addFinalEvent() {
    if (!this.finalEventName) {
      return;
    }
    this.addEvent("ws", this.finalEventName, this.finalEventMessage());
  }

  addEvent(type: DispatcherEventType, name: string, message?: WSMessage<unknown>) {
    const isDupe = this.events
      ?.filter((e) => e.name === name)
      .map((e) => JSON.stringify(e.message))
      .includes(JSON.stringify(message));

    if (this.finishedAt || isDupe) {
      return;
    }

    const event = new DispatcherEvent(type, this.createdAt, name, message);

    if (!this.events) {
      this.events = [event];
    } else {
      this.events.push(event);
    }

    if (this.expectedEvents === this.events.length && this.finalEventName) {
      this.addFinalEvent();
    }

    if ((this.finalEventName && this.finalEventName === event.name) || !this.finalEventName) {
      clearTimeout(this.timeout);
      this.finish();
    }
    return event;
  }

  finish() {
    this.finishedAt = Date.now();
    if (this.debugMode) {
      console.groupCollapsed(
        `MB-WEB-SDK::LOG::${this.id} - '${this.endpoint}' - Total duration: ${msFormat(this.finishedAt - this.createdAt)}`,
      );
      console.table(this.events, ["type", "name", "duration"]);
      console.groupEnd();
    }
  }
}

export class Dispatcher {
  requests: Array<Request> = [];
  debugMode: boolean;

  constructor(debugMode?: boolean) {
    this.debugMode = debugMode || false;
  }

  add(
    endpoint: string,
    config?: {
      finalEventName: string;
      timeoutEventName?: string;
      expectedEvents?: number;
    },
  ) {
    const request = new Request(endpoint, { ...config, debugMode: this.debugMode });
    this.requests.push(request);
    return request;
  }

  getById(id: string) {
    return this.requests.find((request) => request.id === id);
  }
}
