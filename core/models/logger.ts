import { msFormat } from "../utils/toolbox";

type SubProcessType = "fetch" | "ws";

export class SubProcess {
  createdAt: number;
  finishedAt?: number;
  name: string;
  type: SubProcessType;
  duration?: number;

  constructor(type: SubProcessType, createdAt: number, name: string) {
    this.createdAt = createdAt;
    this.finishedAt = Date.now();
    this.type = type;
    this.duration = this.finishedAt - this.createdAt;
    this.name = name;
  }
}

export class Log {
  id?: string;
  createdAt: number;
  finishedAt?: number;
  subProcesses?: SubProcess[];
  endpoint: string;

  constructor(endpoint: string) {
    this.createdAt = Date.now();
    this.endpoint = endpoint;
  }

  addSubProcess(subProcessType: SubProcessType, name: string) {
    const subProcess = new SubProcess(subProcessType, this.createdAt, name);
    if (!this.subProcesses) {
      this.subProcesses = [subProcess];
    } else {
      this.subProcesses.push(subProcess);
    }
    return subProcess;
  }

  finish() {
    this.finishedAt = Date.now();
    console.groupCollapsed(
      `MB-WEB-SDK::LOG::${this.id} - '${this.endpoint}' - Total duration: ${msFormat(this.finishedAt - this.createdAt)}`,
    );
    console.table(this.subProcesses, ["type", "name", "duration"]);
    console.groupEnd();
  }
}

export const maxLogs = 100;

export class Logger {
  private logs: Log[] = [];

  add(endpoint: string) {
    if (this.logs.length >= maxLogs) {
      this.logs.shift();
    }
    const log = new Log(endpoint);
    this.logs.push(log);
    return log;
  }

  getById(id: string) {
    return this.logs.find((log) => log.id === id);
  }
}
