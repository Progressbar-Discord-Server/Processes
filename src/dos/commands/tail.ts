import { DOSCommands } from "./base.js";
import type { Config } from "../config";
import { CategoryChannel, type Client } from "discord.js";

class Tail extends DOSCommands {
  public name = "tail";
  async execute(config: Config, client: Client, args: string[]) {
    if (config.drives.current === "C" || config.drives.S.current == null) {
      console.log("Please, enter a server in the 'S' drive");
      return;
    }

    const channel = args[1]
    if (!channel) {
      console.log('A channel id is required');
      return
    }

    const server = (await client.guilds.fetch(config.drives.S.current)).channels.cache.get(channel);
    if (!server || server instanceof CategoryChannel) {
      console.log("Couldn't find a channel with that id, or that channel can't countain messages.");
      return;
    }

    const MessageAmount = parseInt(args[2]) || 10
    for (const [, e] of await server.messages.fetch({ limit: MessageAmount })) {
      console.log(`${e.id.padEnd(20)}${(e.author.discriminator !== "#0" ? e.author.username : `${e.author.username}#${e.author.discriminator}`).padEnd(13)}${e.content}`)
    }
  }
}

export default new Tail();