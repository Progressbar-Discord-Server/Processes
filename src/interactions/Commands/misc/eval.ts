import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Interaction } from "../../base.js";
import { ExtendedClient } from "../../../Client.js";

class Eval extends Interaction {
  public data = new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Execute Unsigned code")
    .addStringOption(o => o
      .setName("code")
      .setDescription("The code to execute"))
    .toJSON();
  
  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const code = interaction.options.getString("code", true)
    const client: ExtendedClient = interaction.client;

    if (!client.config) return interaction.followUp("No configs found, pls add one.");

    if (client.config.ownersIds instanceof Array) {
      if (!client.config.ownersIds.includes(interaction.user.id)) return interaction.followUp("You aren't authorized to execute this")
      
      console.log(`Eval used by ${interaction.user.discriminator === "#0" ? interaction.user.username : interaction.user.username + "#" + interaction.user.discriminator} for ${code}`)
      return eval(`await (async () => {${code}})().catch(err => {console.error(err)})`)
    }
    
    return interaction.reply("Next time, use an array for ownerIds, i can't understand if it's not a string of arrays...")
  }
}

export default new Eval();