import { ChatInputCommandInteraction, BaseInteraction } from "discord.js";
import { Client } from "../../Client";
import { Events } from "../base.js";

async function execute(interaction: BaseInteraction): Promise<void> {
  if (interaction instanceof ChatInputCommandInteraction) {
    await checkCommand(interaction);
  }
  
  // Defining functions
  async function checkCommand(interaction: ChatInputCommandInteraction) {
    const client: Client = interaction.client;
    if (client.interactions == undefined) return;
    
    const command = client.interactions.get("commands")?.get(interaction.commandName);
    if (command == undefined) return;
  
    await command.execute(interaction);
  }
}

export default new Events("interactionCreate", execute)