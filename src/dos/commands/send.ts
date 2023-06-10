import { DOSCommands } from "./base.js";
import type { Client } from "../../Client";
import type { Config } from "../config";
import { CategoryChannel, PartialGroupDMChannel, ForumChannel } from "discord.js";

export default new DOSCommands("send", async (config: Config, client: Client, args: string[] ) => {
  console.log(args)
  if (args.length > 2) {
    console.log("You have to provide at least 2 argument: <channel id> <message>")
    return;
  }

  const channel = await client.channels.fetch(args[0]);
  if (!channel) {
    console.log(`No channel exist with id: '${args[0]}'!`);
    return;
  }

  if (
    channel instanceof CategoryChannel ||
    channel instanceof PartialGroupDMChannel ||
    channel instanceof ForumChannel
  ) {
    console.log("The specified channel can't countain any messages!")
    return;
  }
  channel.send(args.slice(1).join(" "))
})