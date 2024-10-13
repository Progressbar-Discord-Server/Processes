import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, escapeMarkdown } from 'discord.js';
import { Client } from 'discord.js';
import { Interaction } from '../../NormalInteraction.js';

class Kick extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription("kick a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption(o => o
      .setDescription("The user to kick")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be kicked?")
      .setRequired(true))
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    const client: Client = interaction.client;
    await interaction.deferReply()
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const db = client.db?.cases;

    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs.")

    if (!db) return interaction.followUp("Couldn't obtain the db");

    let guild = interaction.guild
    if (!guild) guild = await interaction.client.guilds.fetch(interaction.guildId);

    const member = await guild.members.fetch({ user: user.id });

    const avatar = user.avatarURL({ extension: "png", size: 512 }) || undefined;
    const username = escapeMarkdown(user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`);
    const execUsername = escapeMarkdown(interaction.user.discriminator !== "#0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`);

    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been kicked from ${guild.name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${username} has been kicked for:** ${reason}`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Database error | Kick`, iconURL: (avatar ? avatar : undefined) })
      .setColor("#f04a47")
      .setTimestamp(Date.now())
      .addFields(
        { name: "**User**", value: `**${username}** (${user.id})`, inline: true },
        { name: "**Moderator**", value: `**${execUsername}** (${interaction.user.id})`, inline: true },
        { name: "**Reason**", value: escapeMarkdown(reason), inline: true }
      );

    if (user.id === interaction.user.id) return interaction.followUp("Why do you want to kick yourself?")
    if (user.id === interaction.client.user.id) return interaction.followUp("Why would you kick me? 😢")

    if (member.kickable) {
      await user.send({ embeds: [dmEmbed] }).catch(() => { console.error(`Couldn't message ${username} (kick)`) })

      await guild.members.kick(user, reason)

      const dbcr = await db.create({
        Executor: interaction.user.id,
        userID: user.id,
        reason: reason,
        type: "kick",
      }).catch(() => null);

      if (dbcr) logEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Kick`, iconURL: avatar });


      if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] });
    }

    interaction.followUp({ embeds: [replyEmbed] })
  }
}

export default new Kick();