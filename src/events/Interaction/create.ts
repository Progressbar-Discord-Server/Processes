import { ChatInputCommandInteraction, ContextMenuCommandInteraction, ModalSubmitInteraction, codeBlock, Interaction } from "discord.js";
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

    const command = client.interactions.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction).catch(e => {
      console.error(e);
      if (interaction.deferred) return interaction.followUp(`An error ocurred while running this command: ${codeBlock(e)}`);
      interaction.reply(`An error ocurred while running this command: ${codeBlock(e)}`);
    });
  }

  async getContext(interaction: ContextMenuCommandInteraction): Promise<void> {
    const client: ExtendedClient = interaction.client;
    if (!client.interactions) return;

    const context = client.interactions.context.get(interaction.commandName);
    if (!context) return; 

    await context.execute(interaction).catch(e => {
      console.error(e);
      if (interaction.deferred) interaction.followUp(`An error ocurred while running this context menu: ${codeBlock(e)}`);
      else interaction.reply(`An error ocurred while running this context menu: ${codeBlock(e)}`);
    });
  }

  async getModal(interaction: ModalSubmitInteraction) {
    const client: ExtendedClient = interaction.client;
    if (!client.interactions) return;

    let modal = client.interactions.modal.name.get(interaction.customId);
    if (!modal) {
      for (const e of client.interactions.modal.startWith.keys()) {
        // @ts-expect-error
        if (interaction.customId.startsWith(e)) modal = client.interactions.modal.startWith.get(e);
      }
    };
    if (!modal) return;

    await modal.execute(interaction).catch(e => {
      console.error(e);
      if (interaction.deferred) interaction.followUp(`An error ocurred while running this modal: ${codeBlock(e)}`);
      else interaction.reply(`An error ocurred while running this modal: ${codeBlock(e)}`);
    });
  }
}