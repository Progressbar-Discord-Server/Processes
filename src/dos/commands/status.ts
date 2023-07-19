import { DOSCommands } from "./base.js";
import type { ExtendedClient } from "../../Client";
import type { Config } from "../config";

class Status extends DOSCommands {
  public name = "status";
  public execute = async (config: Config, client: ExtendedClient, args: string[]) => {
    if (args.join("").trim() == "") client.user?.setActivity()

    const status = args[1]
    const activity = args[2].toUpperCase()
    const description = args.slice(3).join(" ")

    // @ts-expect-error
    client.user?.setActivity(description, { type: activity });
    // @ts-expect-error
    client.user?.setStatus(status);

  }
}

export default new Status();