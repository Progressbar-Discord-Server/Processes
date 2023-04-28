import type { Client } from "../../Client";
import type { Config } from "../config";

export const name = "status";

export async function execute(client: Client, config: Config, args: string[]) {
  if (args.join("").trim() == "") client.user?.setActivity()

  const status = args[1]
  const activity = args[2].toUpperCase()
  const description = args.slice(3).join(" ")

  // @ts-expect-error
  client.user?.setActivity(description, { type: activity });
  // @ts-expect-error
  client.user?.setStatus(status);

}