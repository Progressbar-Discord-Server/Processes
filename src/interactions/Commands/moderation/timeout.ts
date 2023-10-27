import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, escapeMarkdown, codeBlock } from 'discord.js';
import { ExtendedClient } from '../../../Client.js';
import { Interaction } from '../../base.js';

type TimeoutUnits = "s" | "m" | "h" | "d";

type UnitDef = {
  name: string
  math: (length: number) => number
};

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
      .setName('length')
      .setDescription('How much time to timeout.')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription('Why should this user be timed out?'))
    .toJSON();

  public beta = false;
  public enable = true;

  #map: Record<TimeoutUnits, UnitDef> = {
    s: {
      name: "seconds",
      math: (length: number) => Math.floor(length * 1000),
    },
    m: {
      name: "minutes",
      math: (length: number) => Math.floor(length * 60 * 1000)
    },
    h: {
      name: "hours",
      math: (length: number) => Math.floor(length * 60 * 60 * 1000)
    },
    d: {
      name: "days",
      math: (length: number) => Math.floor(length * 24 * 60 * 60 * 1000)
    },
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    const client: ExtendedClient<true> = interaction.client;
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString('reason') || "No reason provided";
    const lengthNUnit = interaction.options.getString('length', true);

    const unitChar = lengthNUnit[lengthNUnit.length - 1];
    const RealLen = parseInt(lengthNUnit.slice(0, -1));

    if (!this.#isValidUnit(unitChar)) {
      const str = [];
      for (const unit of Object.keys(this.#map)) str.push(`\`${unit}\` for ${this.#map[unit as TimeoutUnits].name}`);
      
      return interaction.followUp(`The unit \`${unitChar}\` is not valid.\nValid units:\n${str.join(",\n")}`);
    }
    const unit = this.#map[unitChar];

    const db = client.db?.cases

    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs");
    const guild = await client.guilds.fetch(interaction.guildId);

    const member = await guild.members.fetch({ user: user.id });
    if (!member) return interaction.followUp("Which member do you want to timeout?");

    if (!db) return interaction.followUp("Couldn't find the database.")

    const avatar = user.avatarURL({ extension: 'png', size: 512 }) || undefined;
    const username = escapeMarkdown(user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`);
    const execUsername = escapeMarkdown(interaction.user.discriminator !== "#0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`);

    const dmEmbed = new EmbedBuilder()
      .setColor("#f04a47")
      .setDescription(`**You have been timed out from ${escapeMarkdown(guild.name)} for**: ${reason}`);
    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${username} has been timed out for ${RealLen} ${unit.name} for **"${escapeMarkdown(reason)}".**`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Database error | Timeout`, iconURL: avatar })
      .setColor("#f04a47")
      .setTimestamp(Date.now())
      .addFields(
        { name: "**User**", value: `**${username}** (${user.id})`, inline: true },
        { name: "**Moderator**", value: `**${execUsername}** (${interaction.user.id})`, inline: true },
        { name: "**Reason**", value: escapeMarkdown(reason) },
        { name: "**Time**", value: `${RealLen} ${unit.name}` }
      );

    if (reason === "No reason provided") replyEmbed.setDescription(`**${username} has been timed out for ${RealLen} ${unit.name}.**`);

    if (user.id === client.user.id) {
      if (reason === "No reason provided") replyEmbed.setDescription(`**Didn't timed out myself for ${RealLen} ${unit.name}**`);
      else if (reason !== "No reason provided") replyEmbed.setDescription(`Didn't timed out myself for ${RealLen} ${unit.name} for **${reason}.**`);

      replyEmbed.setColor("#ff0000");

      return interaction.followUp({ embeds: [replyEmbed] })
    }

    const length = unit.math(RealLen);

    if (length > 2.4192e+9) {
      replyEmbed.setColor("#ff0000");
      replyEmbed.setDescription(`**I cannot timeout ${username} for *that* long! You provided a time longer than 28 days!**`);
      return interaction.followUp({ embeds: [replyEmbed] });
    }

    try {
      await member.timeout(length, reason)
    } catch (err) {
      console.error(err);
      replyEmbed.setDescription(`Couldn't timeout ${username}: ${codeBlock(String(err))}`);
      replyEmbed.setColor("#ff0000");
      return interaction.followUp({ embeds: [replyEmbed] })
    }

    await user.send({ embeds: [dmEmbed] }).catch(() => console.error(`Couldn't message ${username} (timeout)`))

    const dbcr = await db.create({
      type: "timeout",
      reason: reason,
      Executor: interaction.user.id,
      userID: user.id
    }).catch(() => null);

    if (dbcr) logEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | Timeout`, iconURL: avatar })

    if (client.logging?.moderation) await client.logging.moderation.send({ embeds: [logEmbed] })

    await interaction.followUp({ embeds: [replyEmbed] })
  }

  #isValidUnit(unit: string): unit is TimeoutUnits {
    return Object.keys(this.#map).includes(unit)
  }
}

export default new Timeout();
