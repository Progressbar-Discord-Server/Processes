import { SlashCommandBuilder, EmbedBuilder, escapeMarkdown, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Interaction } from '../../NormalInteraction.js';
import { ExtendedClient } from '../../../Client.js';

class Unban extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('unban')
    .setDescription("Unbans a user")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o
      .setDescription("The user to unban")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be unbanned?"))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const client: ExtendedClient = interaction.client;
    const user = interaction.options.getUser("user");
    if (!user) return interaction.followUp("No user provided (How did you even do that)");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const db = client.db?.cases;
    if (!db) return interaction.followUp("Database not found.");

    const avatar = user.avatarURL({ extension: "png", size: 512 }) ?? undefined;
    const username = escapeMarkdown(user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`);
    const execUsername = escapeMarkdown(interaction.user.discriminator !== "#0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`);

    const replyEmbed = new EmbedBuilder()
      .setDescription(`**${username} has been unbanned with the reason:** ${escapeMarkdown(reason)}`)
      .setColor("#43b582");
    const logEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setAuthor({ name: "Database Error | Unban", iconURL: avatar })
      .setTimestamp(Date.now())
      .addFields([
        { name: "**User**", value: `**${username}** (${user.id})`, inline: true },
        { name: "**Moderator**", value: `**${execUsername}** (${interaction.user.id})`, inline: true },
        { name: "**Reason**", value: escapeMarkdown(reason), inline: true }
      ]);

    if (reason === "No reason provided") replyEmbed.setDescription(`**${username} has been unbanned**`);

    if (!interaction.inGuild()) return;
    const guild = await interaction.client.guilds.fetch(interaction.guildId);
    const guildBan = await guild.bans.fetch(user).catch(() => null)

    if (!guildBan) {
      replyEmbed
        .setDescription(`**${username} wasn't banned in the first place!**`)
        .setColor("#ff0000");
      return interaction.followUp({ embeds: [replyEmbed] })
    }

    await guild.bans.remove(user, reason);

    const dbcr = await db.create({
      Executor: interaction.user.id,
      userID: user.id,
      reason: reason,
      type: "unban",
    }).catch(() => null);
    if (dbcr) logEmbed.setAuthor({name: `Case ${dbcr.dataValues.id} | Unban`, iconURL: avatar});

    if (client.logging?.moderation) client.logging.moderation.send({ embeds: [logEmbed] }).catch(console.error);
    return interaction.followUp({ embeds: [replyEmbed] });
  }
}

export default new Unban();