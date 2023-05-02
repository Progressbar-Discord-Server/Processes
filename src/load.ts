import type { Client } from "./Client.js";
import { getAllInteractions, getAllEvents } from "./GetFiles.js";

export async function load(client: Client) {
  client.interactions = await getAllInteractions();
  await getAllEvents(client).catch(e => {
    console.error(e);
  })
}