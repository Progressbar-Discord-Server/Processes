import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, escapeMarkdown } from 'discord.js';
import { ExtendedClient } from '../../../Client.js';
import { Interaction } from '../../NormalInteraction.js';

class Warn extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription("warn a user")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o
      .setName("user")
      .setDescription("the user to warn")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be warned?")
      .setRequired(true))
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const client: ExtendedClient<true> = interaction.client;
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);
    const db = client.db?.cases;

    if (!interaction.inGuild()) return interaction.followUp("You can't run this command in DMs.");

    if (db === undefined) return interaction.followUp("Database not found");
    
    const avatar = user.avatarURL({ extension: 'png', size: 512 });
    const username = escapeMarkdown(user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`)
    const execUsername = escapeMarkdown(interaction.user.discriminator !== "#0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`);

    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been warned from ${interaction.inCachedGuild() ? interaction.guild.name : (await client.guilds.fetch(interaction.guildId)).name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${username} has been warned for:** ${reason}`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Database error | Warn`, iconURL: (avatar ? avatar : undefined) })
      .setColor("#f04a47")
      .setTimestamp(Date.now())
      .addFields(
        { name: "**User**", value: `**${username}** (${user.id})`, inline: true },
        { name: "**Moderator**", value: `**${execUsername}** (${interaction.user.id})`, inline: true },
        { name: "**Reason**", value: escapeMarkdown(reason), inline: true }
      );

    if (user.id === client.user.id) return interaction.followUp("I just deleted my own warn <:trollface:990669002999201852>");

    const dbcr = await db.create({
      type: "warn",
      reason: reason,
      Executor: interaction.user.id,
      userID: user.id
    });

    logEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Warn`, iconURL: (avatar ? avatar : undefined) });

    if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] });


    await user.send({ embeds: [dmEmbed] }).catch(() => { console.error(`Couldn't message ${username} (warn)`) });
    await interaction.followUp({ embeds: [replyEmbed] });
  }
}

export default new Warn();