import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

export const name = "test";
export const slash = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Test the bot");

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  interaction.reply({ content: "Well, TS Processes works!" });
}
