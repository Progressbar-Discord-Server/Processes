import { DOSCommands } from "./base.js"
import type { ExtendedClient } from "../../Client"
import type { Config } from "../config"

class Eval extends DOSCommands {
  public name = "eval";
  public execute = async (config: Config, client: ExtendedClient, args: string[]) => {
    try {
      await eval(`(async () => {console.log(${args.join(" ")})})()`);
    } catch (error) {
      console.error(error)
    }
    return config;
  }
}

export default new Eval();
