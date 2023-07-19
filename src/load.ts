import type { ExtendedClient } from "./Client.js";
import { getAllInteractions, getAllEvents } from "./GetFiles.js";

export async function load(client: ExtendedClient) {
  const map = new Map();
  const [commandsInteraction, contextInteraction] = await getAllInteractions(true);
  map.set("commands", commandsInteraction);
  map.set("context", contextInteraction);
  client.interactions = map;

  await getAllEvents(client, true).catch(e => {
    console.error(e);
  });
}