import type { ExtendedClient } from "../../Client.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import type { Config } from "../config.js";
import { DOSCommands } from "./base.js";

class DeployCommands extends DOSCommands {
  public name = "deploy";
  public execute = async (config: Config, client: ExtendedClient) => {
    const { send } = await import("../../deployCommand.js");
    const { bot: { beta: pushBetaCommands } } = await import("../../config.js");

    const all: RESTPostAPIApplicationCommandsJSONBody[] = []
    if (client.interactions) client.interactions.forEach(e => {
      e.forEach(e => {
        const betaStatus = e.beta || false;
        const enable = e.enable || true;
        if (!pushBetaCommands && betaStatus && enable || enable && pushBetaCommands) all.push(e.data)
      })
    });

    send(all, client.token ? client.token : (await import("../../config.js")).bot.token);
  }
}

export default new DeployCommands();