import type { Client } from "../../Client.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

export const name = "deploy";

export async function execute(client: Client) {
  const { send } = await import("../../deployCommand.js");
  const { bot: { beta } } = await import("../../config.js");

  const all: RESTPostAPIApplicationCommandsJSONBody[] = []
  if (client.interactions) client.interactions.forEach(e => {
    e.beta = e.beta || false;
    if (beta && e.beta || !beta) all.push(e.data.toJSON())
  });


  
  send(all, client.token ? client.token : (await import("../../config.js")).bot.token);
}