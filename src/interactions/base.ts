import type { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

export abstract class Interaction {
  public abstract data: ReturnType<ContextMenuCommandBuilder['toJSON']> | ReturnType<SlashCommandBuilder['toJSON']>;
  public abstract execute(this: Interaction, ...args: any[]): Promise<unknown>;
  public abstract beta: boolean;
  public abstract enable: boolean;
}