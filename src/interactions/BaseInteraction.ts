import { If, ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

export abstract class BaseInteraction<T extends boolean = false> {
  public abstract data: If<T, ReturnType<ContextMenuCommandBuilder['toJSON']> | ReturnType<SlashCommandBuilder['toJSON']>>;
  public abstract execute(this: BaseInteraction, ...args: any[]): Promise<unknown>;
  public abstract beta: boolean;
  public abstract enable: boolean;
}