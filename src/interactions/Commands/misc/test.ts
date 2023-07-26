import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Interaction } from "../../base.js";

class Test extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command to test things")
    .addSubcommandGroup(scg => scg
      .setName("message")
      .setDescription("Send a message")
      .addSubcommand(sc => sc
        .setName("simple")
        .setDescription("Send a simple message")
        .addStringOption(o => o
          .setName("content")
          .setDescription("the content of the message")
          .setRequired(true))
        .addBooleanOption(o => o
          .setName("ephemeral")
          .setDescription("Is the message hidden from eveyone?")
          .setRequired(true))))
    .toJSON();
    

  public beta = false;    
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommand()) {
      case "simple": {
        interaction.reply({ content: interaction.options.getString("content") || "", ephemeral: interaction.options.getBoolean("ephemeral") || false })
        break
      }
    }
  }
}

export default new Test();