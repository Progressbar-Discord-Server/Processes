import type { Config } from "../config.js"
import type { Client } from "../../Client.js"

export abstract class DOSCommands {
  public abstract name: string | string[];
  public abstract execute: (this: DOSCommands, config: Config, client: Client, args: string[], ...rest: any[]) => Promise<Config | void>;
}