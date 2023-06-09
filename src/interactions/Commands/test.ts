import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { Interaction } from "../base.js";

const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Test the bot");

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  interaction.reply({ content: "Well, TS Processes works!" });
}

export default new Interaction(data, execute, true)