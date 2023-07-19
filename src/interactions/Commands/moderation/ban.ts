import { ChatInputCommandInteraction, EmbedBuilder, Guild, GuildMember, PermissionFlagsBits, SlashCommandBuilder, escapeMarkdown } from "discord.js";
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
    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const joke = interaction.options.getBoolean("joke", true); 

    let guild: Guild;
    if (interaction.inCachedGuild()) guild = interaction.guild;
    else guild = await interaction.client.guilds.fetch(interaction.guildId);
    
    let member = interaction.options.getMember("user");
    if (!member) return interaction.followUp("A user is required.");
    
    if (!(member instanceof GuildMember)) {
      // @ts-expect-error
      member = await guild.members.fetch(member).catch(() => null)
    }
    
    if (!member) return interaction.followUp("The user couldn't be obtained.");
    const db = client.db?.cases;
    
    if (!db) return interaction.followUp("Database not found")

    const avatar = member.user.avatarURL({ extension: "png", size: 4096 }) || undefined;
    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been banned from ${guild.name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${escapeMarkdown(member.user.tag)} (${member.user.id}) has been banned for:** ${reason}`);
    const logEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setAuthor({ name: `Case idk | Ban | ${member.user.tag} | ${interaction.user.tag}`, iconURL: avatar })
      .setTimestamp(Date.now())
      .addFields(
        { name: "**User**", value: escapeMarkdown(member.user.tag ? member.user.tag : "<@" + member.user.id + ">"), inline: true },
        { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
        { name: "**Reason**", value: reason, inline: true }
      );

    if (member.user.id === interaction.user.id) return interaction.followUp("Why do you want to ban yourself?")
    if (member.user.id === interaction.client.user.id) return interaction.followUp("❌ Why would you ban me? 😢")

    if (member.bannable) {
      // @ts-expect-error
      await member.user.send({ embeds: [dmEmbed] }).catch(() => console.error(`Couldn't message ${member.user.tag} (ban)`))

      if (!joke) {
        await guild.members.ban(member.user, { reason: reason }).catch((err) => {
          console.error(err)
          interaction.followUp("Couldn't ban that user")
        })

        const dbcr = await db.create({
          Executor: interaction.user.id,
          userID: member.user.id,
          reason: reason,
          type: "ban",
        });

        replyEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Ban | ${member.user.tag} | ${interaction.user.tag}`, iconURL: avatar })

        if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] }).catch(console.error)
      }
    }
    interaction.followUp({ embeds: [replyEmbed] }).catch(console.error)
  }
}

export default new Ban();