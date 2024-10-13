import { CategoryChannel, ModalSubmitInteraction, PartialGroupDMChannel } from "discord.js";
import { ModelInteraction } from "../ModalInteraction.js";

class EditMessageModel extends ModelInteraction {
  public beta = false;
  public enable = true;
  public name = "emes-";
  public isStartOfName = true;

  async execute(interaction: ModalSubmitInteraction): Promise<any> {
    const client = interaction.client;
    const customId = interaction.customId;

    const Ids = customId.split("-");
    const channel = await client.channels.fetch(Ids[1]).catch(() => {return null;});
    if (!channel) return interaction.reply("Couldn't fetch the channel");
    if (channel instanceof CategoryChannel || channel instanceof PartialGroupDMChannel) return null;
    
    const message = await channel.messages.fetch(Ids[2]).catch(() => {return null;});
    if (!message) return interaction.reply("Couldn't fetch the message");
    message.edit(interaction.fields.getTextInputValue("new-message"))
    return interaction.reply({content: "Done", ephemeral: true});
  }
}

export default new EditMessageModel();