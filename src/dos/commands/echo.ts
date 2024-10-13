import { DOSCommands } from "./base.js"; 
import type { Client } from "discord.js";
import type { Config } from "../config";

class Echo extends DOSCommands {
  public name = "echo";
  public execute = async (config: Config, Client: Client, args: string[]) => {
    console.log(args.join(""))
  }
}

export default new Echo();