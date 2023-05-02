import { ChatInputCommandInteraction, BaseInteraction } from "discord.js";
import { Client } from "../../Client";

export const name = "interactionCreate";
export const once = false;

export async function execute(interaction: BaseInteraction): Promise<void> {
  if (interaction instanceof ChatInputCommandInteraction) {
    await checkCommand(interaction);
  }
  
  // Defining functions
  async function checkCommand(interaction: ChatInputCommandInteraction) {
    const client: Client = interaction.client;
    if (client.interactions == undefined) return;
    
    const command = client.interactions.get(interaction.commandName);
    if (command == undefined) return;
  
    await command.execute(interaction);
  }
}
