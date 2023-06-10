import type { Config } from "../config.js"
import type { Client } from "../../Client.js"

export class DOSCommands {
  name: string | string[];
  execute: (config: Config, client: Client, args: string[], ...rest: any[]) => Promise<Config> | Promise<void>;

  constructor(name: string | string[], execute: (config: Config, client: Client, ...args: any[]) => any) {
    this.name = name;
    this.execute = execute;
  }
}