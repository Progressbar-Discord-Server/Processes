import { SlashCommandBuilder, EmbedBuilder, ChannelType, ChatInputCommandInteraction, InteractionContextType } from 'discord.js';
import { Interaction } from '../../NormalInteraction.js';

class Lock extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('lock')
    .setDescription("Lock a channel")
    .setContexts(InteractionContextType.Guild)
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
    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs.")
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const role = interaction.options.getRole('role', true)

    channel.permissionOverwrites.edit(role.id, {
      SendMessages: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
    }, { reason: reason, type: 0 });
    
    const replyEmbed = new EmbedBuilder()
      .setColor("#00FF00")
      .setDescription("Channel locked");
    
    interaction.followUp({ embeds: [replyEmbed] });
  }
}

export default new Lock();