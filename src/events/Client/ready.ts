import type { OAuth2Guild, Collection } from "discord.js";
import type { Client } from "../../Client";
import { ProcessDOS } from "../../dos/main.js"
import { Events } from "../base.js";
import { errorToEmbed } from "../../util/errorConverter.js";

class Ready extends Events {
  public name = "ready";
  public once = true;

  public execute = async (client: Client): Promise<void> => {
    console.log(`Connected as ${client.user?.tag}`);

    const guilds = await client.guilds.fetch();
    ProcessDOS(client);
    await fetchAllChannels(guilds);
    console.log("Every guilds has been loaded");

    // Defining functions
    async function fetchAllChannels(guilds: Collection<string, OAuth2Guild>): Promise<void> {
      for (const [, guild] of guilds) {
        console.log(`Fetching all channels & threads from ${guild.name} (${guild.id})...`)
        const guildData = await guild.fetch()
        await guildData.channels.fetch();

        console.log(`Fetched all channels from ${guild.name}.`)
      }
    }

    process.on("uncaughtException", (error) => {
      console.error(error);
      if (client.logging) client.logging.error.send({ embeds: [errorToEmbed(error, "uncaughtException")] });
    });

    process.on("unhandledRejection", (error) => {
      console.error(error);
      if (client.logging) client.logging.error.send({ embeds: [errorToEmbed(error, "unhandledRejection")] });
    });
  }
}

export default new Ready();