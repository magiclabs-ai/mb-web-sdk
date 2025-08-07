import { faker } from "@faker-js/faker";
import { defaultTimeoutDelay } from "../config";
import { msFormat, msToSeconds } from "../utils/toolbox";
import _ from "lodash";
import type { MonitoringEventsBody } from "./api/endpoints/monitoring";

export type DispatcherEventType = "fetch" | "ws";

export type WSMessage<T> = {
  eventType?: string;
  eventName: string;
  requestId?: unknown;
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

export type AddEvent = (type: DispatcherEventType, name: string, message?: WSMessage<unknown>) => void;
export type BeforeFinalEvent = (events: Array<DispatcherEvent>, addEvent: AddEvent, requestId: string) => void;

export class Request {
  id: string;
  createdAt: number;
  eventType?: string;
  finishedAt?: number;
  events?: DispatcherEvent[];
  endpoint: string;
  expectedEvents?: number;
  finalEventName?: string;
  timeoutEventName?: string;
  beforeFinalEvent?: BeforeFinalEvent;
  debugMode: boolean;
  timeout?: NodeJS.Timeout;
  logTimeoutFn: (body: MonitoringEventsBody) => void;
  hasTimedOut: boolean;

  constructor(
    endpoint: string,
    config: {
      eventType?: string;
      finalEventName?: string;
      expectedEvents?: number;
      timeoutEventName?: string;
      beforeFinalEvent?: BeforeFinalEvent;
      debugMode: boolean;
      timeoutDelay?: number;
      logTimeoutFn?: (body: MonitoringEventsBody) => void;
    },
  ) {
    this.id = faker.string.uuid();
    this.createdAt = Date.now();
    this.endpoint = endpoint;
    this.eventType = config?.eventType;
    this.expectedEvents = config?.expectedEvents;
    this.finalEventName = config?.finalEventName;
    this.timeoutEventName = config?.timeoutEventName;
    this.beforeFinalEvent = config?.beforeFinalEvent;
    this.debugMode = config.debugMode;
    this.logTimeoutFn = config.logTimeoutFn || (() => {});
    this.hasTimedOut = false;

    if (this.timeoutEventName) {
      const timeoutDelay = config?.timeoutDelay || defaultTimeoutDelay;
      this.timeout = setTimeout(() => {
        this.hasTimedOut = true;
        this.addEvent("ws", this.timeoutEventName as string, this.finalEventMessage(this.timeoutEventName as string));
        this.addFinalEvent();
      }, timeoutDelay);
    }
  }

  finalEventMessage(eventName: string = this.finalEventName as string) {
    return {
      eventType: this.eventType,
      eventName,
      requestId: this.id,
    };
  }

  addFinalEvent() {
    if (!this.finalEventName) {
      return;
    }
    this.addEvent("ws", this.finalEventName, this.finalEventMessage());
  }

  addEvent(type: DispatcherEventType, name: string, message?: WSMessage<unknown>) {
    const isDupe = this.events?.some((e) => e.name === name && _.isEqual(e.message, message));

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
      if (this.beforeFinalEvent) {
        this.beforeFinalEvent(this.events, this.addEvent.bind(this), this.id);
      }
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
    const duration = this.finishedAt - this.createdAt;
    if (this.debugMode) {
      console.groupCollapsed(
        `MB-WEB-SDK::LOG::${this.id} - '${this.endpoint}' - Total duration: ${msFormat(duration)}`,
      );
      console.table(this.events, ["type", "name", "duration"]);
      console.groupEnd();
    }
    if (this.hasTimedOut) {
      this.logTimeoutFn({
        eventName: this.timeoutEventName || "",
        eventType: this.eventType || "",
        requestId: this.id,
        data: { timeoutDuration: msToSeconds(duration) },
      });
    }
  }
}

export class Dispatcher {
  requests: Array<Request> = [];
  debugMode: boolean;
  logTimeoutFn?: (body: MonitoringEventsBody) => void;

  constructor(debugMode?: boolean, logTimeoutFn?: (body: MonitoringEventsBody) => void) {
    this.debugMode = debugMode || false;
    this.logTimeoutFn = logTimeoutFn;
  }

  add(
    endpoint: string,
    config?: {
      eventType: string;
      finalEventName: string;
      timeoutEventName?: string;
      timeoutDelay?: number;
      expectedEvents?: number;
      beforeFinalEvent?: BeforeFinalEvent;
    },
  ) {
    const request = new Request(endpoint, { ...config, debugMode: this.debugMode, logTimeoutFn: this.logTimeoutFn });
    this.requests.push(request);
    return request;
  }

  getById(id: string) {
    return this.requests.find((request) => request.id === id);
  }
}
