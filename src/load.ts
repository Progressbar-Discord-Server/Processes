import type { Client } from "./Client.js";
import { getAllInteractions, getAllEvents } from "./GetFiles.js";
import { dbinit } from "./database/init.js";

export async function load(client: Client) {
  const map = new Map();
  const [commandsInteraction, contextInteraction] = await getAllInteractions(true);
  map.set("commands", commandsInteraction);
  map.set("context", contextInteraction)
  client.interactions = map;
  await getAllEvents(client, true).catch(e => {
    console.error(e);
  })
  dbinit(client);
}