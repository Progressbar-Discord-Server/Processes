import { Channel } from "discord.js";
import type { ExtendedClient } from "./Client.js";
import { getAllInteractions, getAllEvents, getAllManagers } from "./GetFiles.js";

export async function load(client: ExtendedClient) {
  client.config = await import("./config.js").catch() ?? await import("./exampleConfig.js");
  client.config.bot.token = "";

  const map = new Map();
  const [commandsInteraction, contextInteraction, modelInteraction] = await getAllInteractions(true);
  map.set("commands", commandsInteraction);
  map.set("context", contextInteraction);
  map.set("model", modelInteraction);
  client.interactions = map;

  await getAllEvents(client, true).catch(console.error);
  await getAllManagers(client, true);

  // Setup client.logging

  const logging: Record<string, Channel> = {};
  if (client.config?.logging) {
    for (const [name, id] of Object.entries(client.config.logging)) {
      const channel = await client.channels.fetch(id).catch(err => { console.error(`'${id}' failed to be fetched:\n${err}`) });
      if (!channel) continue;
      logging[name] = channel;
    }
    client.logging = logging;
  }
}