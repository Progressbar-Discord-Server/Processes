import { DOSCommands } from "./base.js"; 
import type { ExtendedClient } from "../../Client";
import type { Config } from "../config";

class Echo extends DOSCommands {
  public name = "echo";
  public execute = async (config: Config, Client: ExtendedClient, args: string[]) => {
    console.log(args.join(""))
  }
}

export default new Echo();