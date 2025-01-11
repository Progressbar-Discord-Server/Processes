import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, escapeMarkdown, InteractionContextType } from "discord.js";
import { Interaction } from "../../../NormalInteraction.js";
import { Client } from "discord.js";

class Warm extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("warm")
    .setDescription("Joke warn")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o
      .setName("user")
      .setDescription('The user to "warm"')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription('The reason of this "warm"'))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const client: Client = interaction.client;
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided.";

    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs!");    
    const guild = await client.guilds.fetch(interaction.guildId);

    const username = user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`;
    
    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been warned from ${guild.name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${escapeMarkdown(username)} (${user.id}) has been warned for:** ${reason}`);

    await user.send({embeds: [dmEmbed]}).catch(() => {});
    await interaction.followUp({embeds: [replyEmbed]}).catch(() => {});
  }
}

export default new Warm()