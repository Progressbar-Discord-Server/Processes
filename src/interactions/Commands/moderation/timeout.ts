import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember, EmbedBuilder, escapeMarkdown, codeBlock, Guild } from 'discord.js';
import { ExtendedClient } from '../../../Client.js';
import { Interaction } from '../../base.js';


class Timeout extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription(`Timeout a member for up to 28 days.`)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o
      .setName("user")
      .setDescription("The user to timeout")
      .setRequired(true))
    .addStringOption(o => o
      .setName('unit')
      .setDescription('In which unit is the duration?')
      .setRequired(true)
      .addChoices({ name: 'seconds', value: 'seconds' }, { name: 'minutes', value: 'minutes' }, { name: 'hours', value: 'hours' }, { name: 'days', value: 'days' }))
    .addIntegerOption(o => o
      .setName("duration")
      .setDescription('How long should this user be timed out for? (max 28 days)')
      .setMaxValue(60)
      .setMinValue(1)
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this supposed to be a joke?")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription('Why should this user be timed out?'))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    let member = interaction.options.getMember("user");
    const client: ExtendedClient<true> = interaction.client;
    const reason = interaction.options.getString('reason') || "No reason provided";
    const unit = interaction.options.getString('unit', true);
    const RealLen = interaction.options.getInteger('duration', true);
    const joke = interaction.options.getBoolean('joke');
    const db = client.db?.cases
    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs");
    let guild: Guild;
    if (interaction.inCachedGuild()) guild = interaction.guild;
    else guild = await interaction.client.guilds.fetch(interaction.guildId);
    
    if (!member) return interaction.followUp("Which member do you want to timeout?");
    
    if (!db) return interaction.followUp("Couldn't find the database.")
    
    if (!(member instanceof GuildMember)) {
      // @ts-expect-error
      member = <GuildMember>await interaction.guild?.members.fetch(member);
    }
    
    const username = member.user.discriminator === "#0" ? member.user.username : `${member.user.username}#${member.user.discriminator}`;
    
    let length = RealLen;
    const crash = false
    
    if (crash) {
      const errorEmbed = new EmbedBuilder()
      .setDescription("You can't timeout someone that isn't in the server.")
        .setColor("#ff0000")
      return interaction.followUp({ embeds: [errorEmbed] })
    }
    const avatar = member.user.avatarURL({ extension: 'png', size: 4096 })

    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been timeout from ${escapeMarkdown(guild.name)} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${escapeMarkdown(username)} has been timed out for ${RealLen} ${unit} for "${reason}".**`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Database error | Timeout | ${username} | ${interaction.user.tag}`, iconURL: (avatar ? avatar : undefined) })
      .setColor("#f04a47")
      .setTimestamp(new Date())
      .addFields(
        { name: "**User**", value: escapeMarkdown(username), inline: true },
        { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
        { name: "**Reason**", value: reason, inline: true }
      );


    if (reason === "No reason provided") {
      replyEmbed.setDescription(`**${escapeMarkdown(username)} has been timed out for ${RealLen} ${unit}.**`)
    }

    if (member.user.id === client.user.id) {
      if (reason === "No reason provided") replyEmbed.setDescription(`Timed out undefined for ${RealLen} ${unit}`)
      else if (reason !== "No reason provided") replyEmbed.setDescription(`Timed out undefined for ${RealLen} ${unit} for **${reason}.**`)
      return interaction.followUp({ embeds: [replyEmbed] })
    }

    if (joke) {
      return interaction.followUp({ embeds: [replyEmbed] })
    }

    switch (unit) {
      case "seconds": { length = Math.floor(length * 1000); break }
      case "minutes": { length = Math.floor(length * 60 * 1000); break }
      case "hours": { length = Math.floor(length * 60 * 60 * 1000); break }
      case "days": { length = Math.floor(length * 24 * 60 * 60 * 1000); break }
    }

    if (length > 2.4192e+9) {
      replyEmbed.setColor("#FF0000");
      replyEmbed.setDescription(`**I cannot timeout ${escapeMarkdown(username)} for *that* long! You provided a time longer than 28 days!**`);
      return interaction.followUp({ embeds: [replyEmbed] });
    }

    if (!joke) {
      let crash = false;
      let err = null;
      await member.timeout(length, reason + " | Timeout by " + interaction.user.tag).catch(error => {
        crash = true;
        err = error;
      })
      
      if (crash) {
        console.error(err);
        replyEmbed.setDescription(`Couldn't timeout ${escapeMarkdown(username)}: ${codeBlock(err || "")}`); replyEmbed.setColor("#ff0000");
        return interaction.followUp({ embeds: [replyEmbed] })
      }

      await member.user.send({ embeds: [dmEmbed] }).catch(() => console.error(`Couldn't message ${username} (timeout)`))
      
      const dbcr = await db.create({
        type: "timeout",
        reason: reason,
        Executor: interaction.user.id,
        userID: member.user.id
      }).catch(() => { });

      if (!dbcr) {
        const noDBEmbed = new EmbedBuilder()
          .setTitle(`${escapeMarkdown(member.user.discriminator === "#0" ? member.user.username : member.user.username + "#" + member.user.discriminator)}`)
          .setDescription("Database error, The case has not been saved")
          .setColor("#ffff00");
        if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] })
        return interaction.reply({ embeds: [noDBEmbed] });
      }

      logEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Timeout | ${username} | ${interaction.user.id}`, iconURL: (avatar ? avatar : undefined) })

      if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] })
    }
    await interaction.followUp({ embeds: [replyEmbed] })
  }
}

export default new Timeout();
