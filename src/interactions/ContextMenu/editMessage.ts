import { ContextMenuCommandBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageContextMenuCommandInteraction, ModalActionRowComponentBuilder } from "discord.js";
import { Interaction } from "../base.js";

const data = new ContextMenuCommandBuilder()
.setName('Edit Bot Message')
.setType(3);

async function execute(interaction: MessageContextMenuCommandInteraction) {
  const message = interaction.targetMessage

  await message.fetch()

  if (message.author.id !== interaction.client.user.id)
    return interaction.reply({content: `This isn't one of my message.\n Please chose a message from myself`, ephemeral: true});

  const textInput = new TextInputBuilder()
  .setCustomId("message")
  .setLabel("message")
  .setValue(message.content)
  .setStyle(TextInputStyle.Paragraph)
  .setRequired(true)

  const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
  .addComponents(textInput);
  
  const modal = new ModalBuilder()
  .setCustomId(`edit-message-${message.id}`)
  .setTitle("Edit Message")
  .setComponents(actionRow);

  await interaction.showModal(modal);
}

export default new Interaction(data, execute)