import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, escapeMarkdown } from "discord.js";
import { Interaction } from "../../../NormalInteraction.js";
import { ExtendedClient } from "../../../../Client.js";

class Bean extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("yail")
    .setDescription("Joke jail")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o
      .setName("user")
      .setDescription('The user to "yail"')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription('The reason of this "yail"'))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const client: ExtendedClient = interaction.client;
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided.";

    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs!");    
    const guild = await client.guilds.fetch(interaction.guildId);

    const username = user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`;
    
    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been jailed from ${guild.name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${escapeMarkdown(username)} (${user.id}) has been jailed for:** ${reason}`);

    await user.send({embeds: [dmEmbed]}).catch(() => {});
    await interaction.followUp({embeds: [replyEmbed]}).catch(() => {});
  }
}

export default new Bean();