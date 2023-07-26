import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Interaction } from "../../base.js";
import { casino } from "../../../config.js";
import { ExtendedClient } from "../../../Client.js";

class Poker extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("casino")
    .setDescription("Play casino games!")
    .addSubcommandGroup(sg => sg
      .setName("poker")
      .setDescription("Play luigi's poker with fake money")
      .addSubcommand(s => s
        .setName("play")
        .setDescription("Play a game of luigi's poker!")
        .addIntegerOption(e => e
          .setName("bet")
          .setDescription("The bet you'd place")
          .setRequired(true)))
      .addSubcommand(s => s
        .setName("help")
        .setDescription("Check how to play!")))
    .addSubcommandGroup(sg => sg
      .setName("leaderboard")
      .setDescription("Check the leaderboard!")
      .addSubcommand(s => s
        .setName("poker")
        .setDescription("Check the luigis poker leaderboard!")))
    .toJSON()

  public beta = false;
  public enable = casino.enable;
  public async execute(interaction: ChatInputCommandInteraction) {
    const client: ExtendedClient<true> = interaction.client;
    switch (interaction.options.getSubcommandGroup()) {
      case "poker": {
        await interaction.deferReply();
        if (!client.managers?.poker) return interaction.editReply("Couldn't find the poker manager (should the command be disabled?)");
        const hand = client.managers.poker.startNewGame(interaction.user.id);
        
        interaction.editReply({
          embeds: [client.managers.poker.makeEmbed(hand)],
        });
        
        break
      }
      case "leaderboard": {
        break
      }
    }
  }
}

export default new Poker();