import { OAuth2Guild, Collection } from "discord.js";
import type { ExtendedClient } from "../../Client";
import { ProcessDOS } from "../../dos/main.js"
import { Events } from "../base.js";
import { errorToEmbed } from "../../util/errorConverter.js";

export default new class ClientReady extends Events {
  public name = "ready";
  public once = true;

  public execute = async (client: ExtendedClient<true>): Promise<void> => {
    console.log(`Connected as ${client.user?.tag}`);

    const guilds = await client.guilds.fetch();
    ProcessDOS(client);
    await this.#fetchAllChannels(guilds);
    console.log("Every guilds has been loaded");

    process.on("uncaughtException", (error) => {
      console.error(error);
      if (client.logging?.error) client.logging.error.send({ embeds: [errorToEmbed(error, "uncaughtException")] }).catch();
    });

    process.on("unhandledRejection", (error) => {
      console.error(error);
      if (client.logging?.error) client.logging.error.send({ embeds: [errorToEmbed(error, "unhandledRejection")] }).catch();
    });
  }

  async #fetchAllChannels(guilds: Collection<string, OAuth2Guild>): Promise<void> {
    for (const [, guild] of guilds) {
      console.log(`Fetching all channels & threads from ${guild.name} (${guild.id})...`)
      const guildData = await guild.fetch()
      await guildData.channels.fetch();

      console.log(`Fetched all channels from ${guild.name}.`)
    }
  }
}