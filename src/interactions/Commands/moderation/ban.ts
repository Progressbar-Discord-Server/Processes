import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, codeBlock, escapeMarkdown, InteractionContextType } from "discord.js";
import { Interaction } from "../../NormalInteraction.js";

class Ban extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption(o => o
      .setName("user")
      .setDescription("The user to ban")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this member be banned?")
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("appeal")
      .setDescription("Send the DM with the appeal?")
      .setRequired(true))
    .addNumberOption(o => o
      .setName("time")
      .setDescription("How long to ban this member?"))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const client = interaction.client;
    const reason = interaction.options.getString("reason") || "No reason provided";
    const user = interaction.options.getUser("user", true);

    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs");
    const guild = await client.guilds.fetch(interaction.guildId);

    const member = await guild.members.fetch({ user: user.id }).catch(() => { return { user: user, bannable: true } });

    const db = client.db?.cases;
    if (!db) return interaction.followUp("Database not found")

    const avatar = user.avatarURL({ extension: "png", size: 512 }) || undefined;
    const username = escapeMarkdown(user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`);
    const execUsername = escapeMarkdown(interaction.user.discriminator !== "#0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`);

    if (user.id === interaction.user.id) return interaction.followUp("Why do you want to ban yourself?")
    if (user.id === interaction.client.user.id) return interaction.followUp("Why would you ban me? 😢")

    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been banned from ${guild.name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${username} (${user.id}) has been banned for:** ${reason}`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Database error | Ban`, iconURL: avatar })
      .setColor("#f04a47")
      .setTimestamp(Date.now())
      .addFields(
        { name: "**User**", value: `**${username}** (${user.id})`, inline: true },
        { name: "**Moderator**", value: `**${execUsername}** (${interaction.user.id})`, inline: true },
        { name: "**Reason**", value: escapeMarkdown(reason), inline: true }
      );

    if (member.bannable) {
      await user.send({ embeds: [dmEmbed] }).catch(() => console.error(`Couldn't message ${username} (ban)`))

      let err;
      try {
        await guild.members.ban(user, { reason: reason })
      } catch {
        console.error(err);
        replyEmbed.setDescription(`Couldn't ban ${username}: ${codeBlock(err || "")}`);
        replyEmbed.setColor("#ff0000");
        return interaction.followUp({ embeds: [replyEmbed] })
      }

      const dbcr = await db.create({
        Executor: interaction.user.id,
        userID: user.id,
        reason: reason,
        type: "ban",
      }).catch(() => null);
      if (dbcr) logEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Ban`, iconURL: avatar });

      if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] }).catch(console.error)
    }
    interaction.followUp({ embeds: [replyEmbed] }).catch(console.error)
  }
}

export default new Ban();