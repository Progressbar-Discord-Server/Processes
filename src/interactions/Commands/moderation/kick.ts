import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder, escapeMarkdown } from 'discord.js';
import { ExtendedClient } from '../../../Client.js';
import { Interaction } from '../../base.js';

class Kick extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription("kick a user")
    .setDMPermission(false)
    .addUserOption(o => o
      .setDescription("The user to kick")
      .setName('user')
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke command?")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be kicked?")
      .setRequired(true))
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    const client: ExtendedClient = interaction.client;
    await interaction.deferReply()
    let member = interaction.options.getMember("user");
    if (!member) return interaction.followUp("You should never see this... or you are hacing discord");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const joke = interaction.options.getBoolean("joke", true);
    const db = client.db?.cases;

    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs.")
    
    if (!db) return interaction.followUp("Couldn't obtain the db");

    let guild = interaction.guild
    if (!guild) guild = await interaction.client.guilds.fetch(interaction.guildId);

    if (!(member instanceof GuildMember)) {
      // @ts-expect-error
      member = await guild.members.fetch(member).catch(() => null)
    }

    if (!member) return interaction.followUp("The user couldn't be fetched.")

    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been kicked from ${guild.name} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${escapeMarkdown(member.user.tag)} has been kicked for:** ${reason}`);
    const logEmbed = new EmbedBuilder()
      .setDescription("Kick")
      .setColor("#f04a47")
      .addFields(
        { name: "**User**", value: escapeMarkdown(member.user.tag), inline: true },
        { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
        { name: "**Reason**", value: reason, inline: true }
      );

    if (member.user.id === interaction.user.id) return interaction.followUp("Why do you want to kick yourself?")
    if (member.user.id === interaction.client.user.id) return interaction.followUp("❌ Why would you kick me? 😢")

    if (member.kickable) {

      // @ts-expect-error
      await member.user.send({ embeds: [dmEmbed] }).catch(() => { console.error(`Couldn't message ${member.user.tag} (kick)`) })

      if (!joke) {
        try {
          guild.members.kick(member.user, reason);
        } catch (err) {
          console.error(err)
          return interaction.followUp("Couldn't kick that user.")
        }

        db.create({
          Executor: interaction.user.id,
          userID: member.user.id,
          reason: reason,
          type: "kick",
        });

        if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] })
      }
    }
    interaction.followUp({ embeds: [replyEmbed] })
  }
}

export default new Kick();