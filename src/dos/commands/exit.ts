import { DOSCommands } from "./base.js"
import type { Config } from "../config"
import type { ExtendedClient } from "../../Client"
import { env, exit } from "node:process"

class Exit extends DOSCommands {
  public name = "exit";
  public execute = async (config: Config, client: ExtendedClient) => {
    if (!env.PM2_USAGE) {
      config.cmd.close();
      await client.destroy();
      exit(0);
    }
    console.log("You are using pm2, to exit the command line, use Ctrl+C.\nIf you want to reload command file, use reload in the C: drive");
    return config;
  }
}

export default new Exit();