import type { Config } from "../config.js"
import { Client } from "discord.js";

export abstract class DOSCommands {
  public abstract name: string | string[];
  public abstract execute(this: DOSCommands, config: Config, client: Client<true>, args: string[], ...rest: any[]): Promise<Config | void>;
  public arguments = "";
  public help = ""; 
}