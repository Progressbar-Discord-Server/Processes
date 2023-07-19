import { ChatInputCommandInteraction, BaseInteraction } from "discord.js";
import { ExtendedClient } from "../../Client";
import { Events } from "../base.js";

class InteractionCreate extends Events {
  public name = "interactionCreate";
  public once = false;

  async execute(interaction: BaseInteraction): Promise<void> {
    if (interaction instanceof ChatInputCommandInteraction) {
      await this.checkCommand(interaction);
    }
  }
  
  async checkCommand(interaction: ChatInputCommandInteraction) {
    const client: ExtendedClient = interaction.client;
    if (client.interactions == undefined) return;

    const command = client.interactions.get("commands")?.get(interaction.commandName);
    if (command == undefined) return;

    await command.execute(interaction);
  }
}

export default new InteractionCreate();