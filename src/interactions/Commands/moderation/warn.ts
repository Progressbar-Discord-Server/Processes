import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, User, escapeMarkdown } from 'discord.js';
import { ExtendedClient } from '../../../Client.js';
import { Interaction } from '../../base.js';

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
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke?")
      .setRequired(true))
    .toJSON();
  
  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    let crash = false

    const client: ExtendedClient<true> = interaction.client;
    const user = interaction.options.getUser("user", true)
    const reason = interaction.options.getString("reason", true)
    const joke = interaction.options.getBoolean("joke", true) || false
    const db = client.db?.csases

    if (!interaction.inGuild()) return interaction.followUp("You can't run this command in DMs.")

    if (db === undefined) {
      return interaction.followUp("Couldn't find the database");
    }

    if (!(user instanceof User)) {
      await client.users.fetch(user).catch(() => { crash = true })
    }

    if (crash) {
      const errorEmbed = new EmbedBuilder()
        .setDescription("You can't warn someone that isn't in the server.")
        .setColor("#ff0000")
      return interaction.followUp({ embeds: [errorEmbed] })
    }

    const avatar = await user.avatarURL({ extension: 'png', size: 4096 })
    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been warned from ${interaction.inCachedGuild() ? interaction.guild.name : (await client.guilds.fetch(interaction.guildId)).name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${escapeMarkdown(user.tag)} has been warned for:** ${reason}`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Case idk | Warn | ${user.tag} | ${user.id}`, iconURL: (avatar ? avatar : undefined) })
      .setColor("#f04a47")
      .setTimestamp(new Date())
      .addFields(
        { name: "**User**", value: escapeMarkdown(user.tag), inline: true },
        { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
        { name: "**Reason**", value: reason, inline: true }
      );

    if (user.id === client.user.id) return interaction.followUp("I just deleted my own warn <:trollface:990669002999201852>")

    if (!joke) {
      const dbcr = await db.create({
        type: "warn",
        reason: reason,
        Executor: interaction.user.id,
        userID: user.id
      });

      logEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Warn | ${user.tag} | ${user.id}`, iconURL: (avatar ? avatar : undefined) })

      if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] })
    }

    await user.send({ embeds: [dmEmbed] }).catch(() => { console.error(`Couldn't message ${user.tag} (warn)`) })
    await interaction.followUp({ embeds: [replyEmbed] })
  }
}

export default new Warn();