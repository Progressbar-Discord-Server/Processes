import type { Client } from "./Client.js";
import { getAllCommands, getAllEvents } from "./GetFiles.js";

export async function load(client: Client) {
  client.commands = await getAllCommands();
  await getAllEvents(client).catch(e => {
    console.error(e);
  })
}