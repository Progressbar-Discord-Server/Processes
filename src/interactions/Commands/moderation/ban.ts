import { ChatInputCommandInteraction, EmbedBuilder, Guild, GuildMember, PermissionFlagsBits, SlashCommandBuilder, codeBlock, escapeMarkdown } from "discord.js";
import { Interaction } from "../../base.js";
import { ExtendedClient } from "../../../Client.js";

class Ban extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(o => o
      .setName("user")
      .setDescription("The user to ban")
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
    .toJSON();

  public beta = false;
  public enable = true;

  public execute = async (interaction: ChatInputCommandInteraction) => {
    interaction.deferReply();
    const client: ExtendedClient = interaction.client;
    const reason = interaction.options.getString("reason") || "No reason provided";
    const joke = interaction.options.getBoolean("joke", true);
    let member = interaction.options.getMember("user");
    
    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs");
    let guild: Guild;
    if (interaction.inCachedGuild()) guild = interaction.guild;
    else guild = await interaction.client.guilds.fetch(interaction.guildId);

    if (!member) return interaction.followUp("A user is required.");

    if (!(member instanceof GuildMember)) {
      // @ts-expect-error
      member = await guild.members.fetch(member).catch(() => null)
    }

    if (!member) return interaction.followUp("The user couldn't be obtained.");
    const db = client.db?.cases;

    if (!db) return interaction.followUp("Database not found")

    const avatar = member.user.avatarURL({ extension: "png", size: 4096 }) || undefined;
    const username = member.user.discriminator === "#0" ? member.user.username : `${member.user.username}#${member.user.discriminator}`;

    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been banned from ${guild.name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${escapeMarkdown(username)} (${member.user.id}) has been banned for:** ${reason}`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Database error | Ban | ${username} | ${interaction.user.tag}`, iconURL: avatar })
      .setColor("#f04a47")
      .setTimestamp(Date.now())
      .addFields(
        { name: "**User**", value: escapeMarkdown(username ? username : "<@" + member.user.id + ">"), inline: true },
        { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
        { name: "**Reason**", value: reason, inline: true }
      );

    if (member.user.id === interaction.user.id) return interaction.followUp("Why do you want to ban yourself?")
    if (member.user.id === interaction.client.user.id) return interaction.followUp("Why would you ban me? 😢")

    if (member.bannable) {
      await member.user.send({ embeds: [dmEmbed] }).catch(() => console.error(`Couldn't message ${username} (ban)`))

      if (!joke) {
        let crash = false;
        let err;
        await guild.members.ban(member.user, { reason: reason }).catch((error) => {
          crash = true;
          err = error
        })

        if (crash) {
          console.error(err);
          replyEmbed.setDescription(`Couldn't ban ${escapeMarkdown(username)}: ${codeBlock(err || "")}`); replyEmbed.setColor("#ff0000");
          return interaction.followUp({ embeds: [replyEmbed] })
        }

        const dbcr = await db.create({
          Executor: interaction.user.id,
          userID: member.user.id,
          reason: reason,
          type: "ban",
        }).catch(() => { });

        if (!dbcr) {
          const noDBEmbed = new EmbedBuilder()
            .setTitle(`${escapeMarkdown(member.user.discriminator === "#0" ? member.user.username : member.user.username + "#" + member.user.discriminator)}`)
            .setDescription("Database error, The case has not been saved")
            .setColor("#ffff00");
          if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] })
          return interaction.reply({ embeds: [noDBEmbed] });
        }

        replyEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Ban | ${username} | ${interaction.user.tag}`, iconURL: avatar })

        if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] }).catch(console.error)
      }
    }
    interaction.followUp({ embeds: [replyEmbed] }).catch(console.error)
  }
}

export default new Ban();