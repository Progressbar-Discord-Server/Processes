import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Interaction {
  name: string;
  beta: boolean | undefined
  data: SlashCommandBuilder;
  
  execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}