import { Client } from "../Client";

export class Events {
  name: string;
  once: boolean;
  execute: (client: Client, ...args: any[]) => any;

  constructor(name: string, execute: (...args: any[]) => any, once?: boolean) {
    this.name = name;
    this.once = once || false;
    this.execute = execute;
  }
}