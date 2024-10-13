import { ContextMenuCommandBuilder, ApplicationCommandType, UserContextMenuCommandInteraction, InteractionContextType } from "discord.js";
import { Interaction } from "../../NormalInteraction.js";

class Warn extends Interaction {
  public data = new ContextMenuCommandBuilder()
    .setName('Warn')
    .setContexts(InteractionContextType.Guild)
    .setType(2)
    .toJSON();

  public beta = false;
  public enable = true;
  public execute = async (interaction: UserContextMenuCommandInteraction) => {
    interaction
  }
}

export default new Warn();