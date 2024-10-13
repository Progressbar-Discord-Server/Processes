import { If, ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

export abstract class BaseInteraction<Data extends boolean = true> {
  public abstract data: If<Data, ReturnType<ContextMenuCommandBuilder['toJSON']> | ReturnType<SlashCommandBuilder['toJSON']>>;
  public abstract execute(this: BaseInteraction<boolean>, ...args: any[]): Promise<unknown>;
  public abstract beta: boolean;
  public abstract enable: boolean;
}