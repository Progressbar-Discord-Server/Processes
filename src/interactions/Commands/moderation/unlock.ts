import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ChannelType, InteractionContextType } from 'discord.js';
import { Interaction } from '../../NormalInteraction.js';

class Unlock extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('unlock')
    .setDescription("Unlock a channel")
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
      .setDescription("Why should this channel be unlocked?"))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) return;

    await interaction.deferReply()
    const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const role = interaction.options.getRole('role', true);
        
    channel.permissionOverwrites.edit(role.id, {
      SendMessages: true,
      SendMessagesInThreads: true,
      CreatePublicThreads: true,
      CreatePrivateThreads: true,
    }, { reason: reason, type: 0 })
    
    const replyEmbed = new EmbedBuilder()
      .setDescription("Channel unlocked")
      .setColor("#00FF00");
    interaction.followUp({ embeds: [replyEmbed] });
  }
}

export default new Unlock();