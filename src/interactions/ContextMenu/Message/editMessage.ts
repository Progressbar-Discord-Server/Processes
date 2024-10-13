import { ContextMenuCommandBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageContextMenuCommandInteraction, ModalActionRowComponentBuilder, InteractionContextType } from "discord.js";
import { Interaction } from "../../NormalInteraction.js";

class EditMessage extends Interaction {
  public data = new ContextMenuCommandBuilder()
    .setName('Edit Bot Message')
    .setContexts(InteractionContextType.Guild)
    .setType(3)
    .toJSON();

  public beta = false;
  public enable = true;
  public execute = async (interaction: MessageContextMenuCommandInteraction) => {
    const message = interaction.targetMessage;

    if (message.author.id !== interaction.client.user.id) return interaction.reply({ content: `This isn't one of my message.\n Please chose a message from myself`, ephemeral: true });

    const textInput = new TextInputBuilder()
      .setCustomId(`new-message`)
      .setLabel("message")
      .setValue(message.content)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
      .addComponents(textInput);

    const modal = new ModalBuilder()
      .setCustomId(`emes-${message.channelId}-${message.id}`)
      .setTitle("Edit Message")
      .setComponents(actionRow);

    await interaction.showModal(modal);
  }
}

export default new EditMessage();