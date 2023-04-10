import type { Command } from "../base.js";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const slash = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a member")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption(o => o
    .setDescription("The member to ban")
    .setName("member")
    .setRequired(true))
  .addStringOption(o => o
    .setName("reason")
    .setDescription("Why should this member be banned?")
    .setRequired(true))
  .addBooleanOption(o => o
    .setName("joke")
    .setDescription("Is this command a joke command?")
    .setRequired(true))
  .addBooleanOption(o => o
    .setName(""))
  .addNumberOption(o => o
    .setName("time")
    .setDescription("How long to ban this member?"));

export function func(interaction: CommandInteraction, entry: Command) {
  interaction.options.getUser("");
}

export const name = "";
