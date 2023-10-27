import { ContextMenuCommandBuilder, ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
import { Interaction } from "../../base.js";

class EditMessage extends Interaction {
  public data = new ContextMenuCommandBuilder()
    .setName('Warn')
    .setDMPermission(false)
    .setType(ApplicationCommandType.User)
    .toJSON();

  public beta = false;
  public enable = true;
  public execute = async (interaction: UserContextMenuCommandInteraction) => {
    interaction
  }
}

export default new EditMessage();