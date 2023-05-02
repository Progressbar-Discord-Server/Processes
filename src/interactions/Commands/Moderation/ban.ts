import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, escapeMarkdown } from "discord.js";

export const name = "ban";
export const data = new SlashCommandBuilder()
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption(o => o
    .setName("member")
    .setDescription("The member to ban")
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
    .setName("appeal")
    .setDescription("Send the appeal")
    .setRequired(true))
  .addNumberOption(o => o
    .setName("time")
    .setDescription("How long to ban this member?"))
  .setName("ban")
  .setDescription("Ban a member");

export async function execute(interaction: ChatInputCommandInteraction) {
  interaction.deferReply();
  const member = interaction.options.getUser("member");
  if (!member) return interaction.editReply("I need a member to ban!")

  const reason = interaction.options.getString("reason") || "";
  await interaction.guild?.bans.create(member, { reason })
  interaction.editReply(`${escapeMarkdown(member.tag)} has been banned.`)
}