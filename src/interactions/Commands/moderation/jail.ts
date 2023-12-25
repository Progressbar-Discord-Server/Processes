import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, escapeMarkdown } from "discord.js";
import { Interaction } from "../../NormalInteraction.js";
import type { ExtendedClient } from "../../../Client.js";

class Jail extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("jail")
    .setDescription("Jail a user.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o
      .setName("user")
      .setDescription("The user to jail")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this member be jailed for?"))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const client: ExtendedClient = interaction.client;
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided.";

    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs");
    const guild = await client.guilds.fetch(interaction.guildId);

    const member = await guild.members.fetch({ user: user.id, force: true });

    if (typeof client.config?.jail.protectorRole === "string" && member.roles.cache.has(client.config.jail.protectorRole)) return interaction.followUp({content: `User has protected role <@&${client.config.jail.protectorRole}>`, allowedMentions: {parse: []}});

    const db = {
      cases: client.db?.cases,
      jailed: client.db?.jailed
    };

    if (!db.cases || !db.jailed) return interaction.followUp("Database not found");

    const avatar = user.avatarURL({ extension: "png", size: 4096 }) || undefined;
    const username = escapeMarkdown(user.discriminator !== "#0" ? user.username : `${user.username}#${user.discriminator}`);
    const execUsername = escapeMarkdown(interaction.user.discriminator !== "#0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`);

    const replyEmbed = new EmbedBuilder()
      .setColor("#43b582")
      .setDescription(`**${username} (${user.id}) has been unjailed.**`);
    const logEmbed = new EmbedBuilder()
      .setAuthor({ name: `Database error | Jailed added or removed`, iconURL: avatar })
      .setColor("#f0ac47")
      .setTimestamp(Date.now())
      .addFields(
        { name: "**User**", value: `**${username}** (${user.id})`, inline: true },
        { name: "**Moderator**", value: `**${execUsername}** (${interaction.user.id})`, inline: true },
        { name: "**Reason**", value: escapeMarkdown(reason), inline: true }
      );

    const jailRole = client.config?.jail.givenRole;
    if (!jailRole) return interaction.followUp("No jailed role found in the config.\n Did you put `export const jailRole = \"<role id>\"`?");

    let type: "Jail removed" | "Jail added" = "Jail removed";
    let dbcr = await db.jailed.findOne({ where: { userID: user.id } });
    if (dbcr) {
      member.roles.remove(jailRole);

      for (const roleId of dbcr.dataValues.roles.split(" ")) {
        member.roles.add(roleId).catch(console.error);
      }
      await db.jailed.destroy({ where: { userID: user.id } });
    } else {
      const roles: string[] = [];
      for (const [, role] of member.roles.cache) { if (role.id !== guild.id) roles.push(role.id); }

      await db.jailed.create({ userID: user.id, roles: roles.join(" ") });
      type = "Jail added";
      replyEmbed.setDescription(`**${username} (${user.id}) has been jailed.**`);

      for (const e of roles) {
        if (e !== "@everyone") member.roles.remove(e);
      }

      await member.roles.add(jailRole, reason);
    }

    dbcr = await db.cases.create({
      userID: user.id,
      Executor: interaction.user.id,
      type,
      reason,
    });

    interaction.followUp({ embeds: [replyEmbed] });

    logEmbed.setAuthor({ name: `Case ${dbcr.dataValues.id} | ${type}`, iconURL: avatar })
    if (client.logging?.moderation) client.logging.moderation.send({ embeds: [logEmbed] })
  }
}

export default new Jail();