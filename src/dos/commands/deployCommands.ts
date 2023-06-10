import { DOSCommands } from "./base.js";
import type { Client } from "../../Client.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { Config } from "../config.js";

export const name = "deploy";

export default new DOSCommands("deploy", async (config: Config, client: Client) => {
  const { send } = await import("../../deployCommand.js");
  const { bot: { beta } } = await import("../../config.js");

  const all: RESTPostAPIApplicationCommandsJSONBody[] = []
  if (client.interactions) client.interactions.forEach(e => {
    e.forEach(e => {
      const betaStatus = e.beta || false;
      if (!beta && betaStatus || beta) all.push(e.data.toJSON())
    })
  });

  send(all, client.token ? client.token : (await import("../../config.js")).bot.token);
})