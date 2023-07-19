import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Interaction } from '../../base.js';

class Ping extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!')
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    const replyEmbed = {
      color: Math.floor(Math.random() * 16777215),
      title: "Pong!",
      description: `Latency of the bot:${Date.now() - interaction.createdTimestamp}ms`
    }
    await interaction.reply({embeds: [replyEmbed], ephemeral: true})

    replyEmbed.description += `\nRound-trip: ${Date.now() - interaction.createdTimestamp}ms`
    return await interaction.editReply({embeds: [replyEmbed]})
  }
}

export default new Ping();