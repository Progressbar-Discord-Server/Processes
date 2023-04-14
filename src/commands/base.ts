import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
  name: string;
  slash: SlashCommandBuilder;
  
  execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}