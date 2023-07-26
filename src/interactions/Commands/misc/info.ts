import { SlashCommandBuilder, GuildMember, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { Interaction } from "../../base.js";

class Info extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get information about something")
    .addSubcommand(sc => sc
      .setName("server")
      .setDescription("Get Information about the server"))
    .addSubcommand(sc => sc
      .setName("user")
      .setDescription("Get information about a user")
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to get information")
        .setRequired(true)))
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) return interaction.reply("You can't use this command in DMs. (How did you even run it throgh DMs in the first place?)");
    await interaction.deferReply({ ephemeral: true });

    const guild = await interaction.client.guilds.fetch(interaction.guildId);

    await interaction.deferReply({ ephemeral: true })

    switch (interaction.options.getSubcommand(true)) {
      case "user": {
        let member = interaction.options.getMember("user");

        if (!member) return interaction.followUp("Couldn't obtain information about the give user.")

        if (!(member instanceof GuildMember)) {
          console.log(member)
          // @ts-expect-error
          member = await guild.members.fetch({user: member});
        }

        const roles: string[] = []
        member.roles.cache.forEach(e => {
          if (e.name !== "@everyone") roles.push(`<@&${e.id}>`)
        })

        const avatar = member.user.avatarURL({ extension: "png", size: 4096 })

        interaction.followUp({
          embeds: [new EmbedBuilder()
            .setAuthor({ name: member.user.tag, iconURL: (avatar ? avatar : undefined) })
            .setDescription(`<@${member.user.id}>`)
            .setColor(Math.floor(Math.random() * 16777215))
            .addFields(
              { name: "**Joined**", value: `<t:${Math.floor(member.joinedTimestamp || NaN / 1000)}:f> (<t:${Math.floor(member.joinedTimestamp || NaN / 1000)}:R>)`, inline: true },
              { name: "**Registered**", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`, inline: true },
              { name: `**Roles [${member.roles.cache.size - 1}]**`, value: roles.join(", ") ? roles.join(", ") : "*none*" },
            )
          ]
        });
        break
      }
      case "server": {
        await guild.fetch()

        const replyEmbed = new EmbedBuilder().setAuthor({ name: guild.name, iconURL: guild.iconURL({ extension: 'png', size: 4096 }) || undefined }).setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`).setFooter({ text: `Id: ${guild.id}` }).setTimestamp(guild.createdAt)

        const owner = await guild.fetchOwner()

        let roleCount = 0
        await guild.roles.fetch().then(e => {
          e.forEach(i => {
            if (i.name === "@everyone") return
            roleCount++
          })
        })

        let emojiCount = 0
        await guild.emojis.fetch().then(e => {
          e.forEach(() => {
            emojiCount++
          })
        })

        let stickerCont = 0
        await guild.stickers.fetch().then(e => {
          e.forEach(() => {
            stickerCont++
          })
        })

        replyEmbed.setFields(
          { name: "Owner", value: `${owner.user.tag}`, inline: true },
          { name: "Roles", value: `${roleCount}`, inline: true },
          { name: "Members", value: `${guild.memberCount}`, inline: true },
          { name: "Emojis", value: `${emojiCount}`, inline: true },
          { name: "Stickers", value: `${stickerCont}`, inline: true },
          { name: "Rules", value: `<#${guild.rulesChannelId}>`, inline: true }
        )
        interaction.followUp({ embeds: [replyEmbed] })
        break
      }
    }
  }
}

export default new Info();