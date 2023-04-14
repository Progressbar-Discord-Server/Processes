import type { OAuth2Guild, Collection } from "discord.js";
import type { Client } from "../Client";

export const once = true;
export const name = "ready";

export async function execute(client: Client): Promise<void> {
  console.log(`Connected as ${client.user?.tag}`);

  const guilds = await client.guilds.fetch();
  // TO-DO: put DOS on this line, so that you don't have to wait ten years for having dos
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
}
