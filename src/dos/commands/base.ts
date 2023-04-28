import type { Config } from "../config.js"
import type { Client } from "../../Client.js"

export interface DOSCommands {
  name: string | string[],
  execute: (client: Client, config: Config, args: string[], ...rest: any[]) => Promise<Config> | Promise<void>,
}