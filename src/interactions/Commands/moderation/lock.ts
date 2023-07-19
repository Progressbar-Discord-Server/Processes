import { SlashCommandBuilder, EmbedBuilder, ChannelType, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { Interaction } from '../../base.js';

class Lock extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('lock')
    .setDescription("Lock a channel")
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("The channel to lock")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true))
    .addRoleOption(o => o
      .setName('role')
      .setDescription("The role to lock access, can be @eveyone")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this channel be locked?"))
    .toJSON();
  
  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    let channel = interaction.options.getChannel("channel", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const role = interaction.options.getRole('role', true)

    if (channel.type !== ChannelType.GuildText) return interaction.reply("You can use this command only with text channels");

    if (!(channel instanceof TextChannel)) {
      channel = <TextChannel> await interaction.guild?.channels.fetch(channel.id);
    }

    channel.permissionOverwrites.edit(role.id, {
      SendMessages: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
    }, { reason: reason, type: 0 });
    
    const replyEmbed = new EmbedBuilder()
      .setColor("#00FF00")
      .setDescription("Channel locked");
    
    interaction.reply({ embeds: [replyEmbed] });
  }
}

export default new Lock();