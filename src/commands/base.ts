import type { CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
  name: string,
  func: (interaction: CommandInteraction, entry?: this) => void,
  slash: SlashCommandBuilder,
}