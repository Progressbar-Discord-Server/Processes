import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ownersIds } from "../../../config.js";
import { Interaction } from "../../base.js";

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
    
    if (ownersIds instanceof Array) {
      if (ownersIds.includes(interaction.user.id)) {
        console.log(`Eval used by ${interaction.user.discriminator === "#0" ? interaction.user.username : interaction.user.username + "#" + interaction.user.discriminator} for ${code}`)
        return eval(`await (async () => {${code}})().catch(err => {console.error(err)})`)
      }
      
      return interaction.followUp("You aren't authorized to execute this")
    }
    else {
      return interaction.reply("Next time, use an array for ownerIds.")
    }
  }
}

export default new Eval();