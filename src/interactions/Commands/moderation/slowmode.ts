import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, ChatInputCommandInteraction } from 'discord.js';
import { Interaction } from '../../base.js';

class Slowmode extends Interaction {
  data = new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription("Set a slowmode in a channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("What channel do you want to apply slowmode to?")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText))
    .addStringOption(o => o
      .setName('unit')
      .setDescription('The unit of time')
      .setRequired(true)
      .addChoices({ name: 'seconds', value: 'seconds' }, { name: 'minutes', value: 'minutes' }, { name: 'hours', value: 'hours' }))
    .addIntegerOption(o => o
      .setName("duration")
      .setDescription('The duration')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why do you want to set a slowmode in this channel?"))
    .toJSON();
  
  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('channel', true, [ChannelType.GuildText]);
    const unit = interaction.options.getString('unit', true);
    const RealLen = interaction.options.getInteger('duration', true);

    if (!interaction.inGuild()) return interaction.reply("This command only works in a guild.");

    const reason = interaction.options.getString('reason') || "No reason provided";
    const replyEmbed = new EmbedBuilder();
    let length = RealLen;

    if (RealLen === 0) {
      channel.setRateLimitPerUser(length, reason);
      replyEmbed.setDescription(`No slowmode set in ${channel} for "**${reason}**"`);
      replyEmbed.setColor('#00FF00');
      interaction.reply({ embeds: [replyEmbed]});
    }
    
    if (unit == "minutes") length = Math.floor(length * 60);
    else if (unit == "hours") length = Math.floor(length * 60 * 60);
    
    if (length > 21600) {
      replyEmbed.setColor("#FF0000");
      replyEmbed.setDescription("You set the slowmode to more then 6 hours, it's imposible for me to execute that...");
      return interaction.reply({ embeds: [replyEmbed] });
    }
    else if (length < 21600) {

      channel.setRateLimitPerUser(length, reason);
      
      replyEmbed.setColor("#00FF00");
      if (reason === "No reason provided") replyEmbed.setDescription(`Set **${RealLen} ${unit}** slowmode in ${channel}`);
      else if (reason !== "No reason provided") replyEmbed.setDescription(`Set **${RealLen} ${unit}** slowmode in ${channel} for "**${reason}**"`);
      
      interaction.reply({ embeds: [replyEmbed] });
    }
  }
}

export default new Slowmode();