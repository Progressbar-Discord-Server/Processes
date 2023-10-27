import { ChatInputCommandInteraction, ContextMenuCommandInteraction, ModalSubmitInteraction, CategoryChannel, PartialGroupDMChannel, codeBlock, Interaction } from "discord.js";
import { ExtendedClient } from "../../Client";
import { Events } from "../base.js";

export default new class InteractionCreate extends Events {
  public name = "interactionCreate" as const;
  public once = false;

  async execute(interaction: Interaction): Promise<any> {
    if (interaction instanceof ChatInputCommandInteraction) return await this.getCommand(interaction);
    if (interaction instanceof ContextMenuCommandInteraction) return await this.getContext(interaction);
    if (interaction instanceof ModalSubmitInteraction) return await this.getModal(interaction);
  }
  
  async getCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const client: ExtendedClient = interaction.client;
    if (!client.interactions) return;

    const command = client.interactions.get("commands")?.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction).catch(e => {
      console.error(e);
      if (interaction.deferred) interaction.followUp(`An error ocurred while running this command: ${codeBlock(e)}`);
      else interaction.reply(`An error ocurred while running this command: ${codeBlock(e)}`);
    });
  }

  async getContext(interaction: ContextMenuCommandInteraction): Promise<void> {
    const client: ExtendedClient = interaction.client;
    if (!client.interactions) return;

    const context = client.interactions.get("context")?.get(interaction.commandName);
    if (!context) return; 

    await context.execute(interaction).catch(e => {
      console.error(e);
      if (interaction.deferred) interaction.followUp(e);
      else interaction.reply(`An error ocurred while running this context menu: ${codeBlock(e)}`);
    });
  }

  async getModal(interaction: ModalSubmitInteraction) {
    const client: ExtendedClient = interaction.client;
    const customId = interaction.customId;

    if (customId.startsWith("emes-")) {
      const Ids = customId.split("-");
      const channel = await client.channels.fetch(Ids[1])
      if (!channel) return interaction.reply("Couldn't fetch the channel");
      if (channel instanceof CategoryChannel || channel instanceof PartialGroupDMChannel) return null;
      
      const message = await channel.messages.fetch(Ids[2]);
      message.edit(interaction.fields.getTextInputValue("new-message"))
      return interaction.reply({content: "Done", ephemeral: true});
    }

    switch (customId) {
      case "": {
        break;
      }
      default: {
        break;
      }
    }
  }
}