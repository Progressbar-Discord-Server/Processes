import type { ExtendedClient } from "../../Client.js";
import { REST, Routes, type RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import type { Config } from "../config.js";
import { DOSCommands } from "./base.js";

class DeployCommands extends DOSCommands {
  public name = "deploy";
  public execute = async (config: Config, client: ExtendedClient) => {
    if (!client.config) return;
    const pushBetaCommands = client.config.bot.beta;

    const all: RESTPostAPIApplicationCommandsJSONBody[] = []
    if (client.interactions) for (const [, interactions] of client.interactions) {
      for (const [, interaction] of interactions) {
        if (!interaction.data) return;
        const betaStatus = interaction.beta ?? false;
        const enable = interaction.enable ?? true;
        if ((enable && !betaStatus) || (enable && betaStatus && pushBetaCommands)) all.push(interaction.data)
      }
    }

    this.send(all, client.token ? client.token : client.config?.bot.token);
  }

  async send(commands: any[], token: string) {
    const rest = new REST({ version: '10' }).setToken(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientId = await rest.get(Routes.user()).then(e => {
      if (typeof e == "object" && e != null && "id" in e && typeof e.id === "string") return e.id;
    })
  
    if (typeof clientId !== "string") throw new Error("The client id of the bot couldn't be obtained.");
  
    console.log(`Started refreshing ${commands.length} interaction commands.`);
    await rest.put(Routes.applicationCommands(clientId), { body: commands }).catch(e => console.error(e));
    console.log(`Successfully reloaded ${commands.length} interaction commands.`);
  }
}

export default new DeployCommands();