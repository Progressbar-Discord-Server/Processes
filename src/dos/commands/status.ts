import { DOSCommands } from "./base.js";
import type { Client } from "../../Client";
import type { Config } from "../config";

export default new DOSCommands("status", (config: Config, client: Client, args: string[]) => {
  if (args.join("").trim() == "") client.user?.setActivity()

  const status = args[1]
  const activity = args[2].toUpperCase()
  const description = args.slice(3).join(" ")

  // @ts-expect-error
  client.user?.setActivity(description, { type: activity });
  // @ts-expect-error
  client.user?.setStatus(status);

})