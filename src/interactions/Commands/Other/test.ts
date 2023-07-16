import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { Interaction } from "../../base.js";

class Test extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test the bot")
    .toJSON();

  public beta = true;
  public enable = true;

  public execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    interaction.reply({ content: "Well, TS Processes works!" });
  }
}

export default new Test();