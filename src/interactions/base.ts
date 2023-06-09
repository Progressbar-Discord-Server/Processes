import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

export class Interaction {
  beta: boolean
  data: SlashCommandBuilder | ContextMenuCommandBuilder;
  execute: (...args: any[]) => any;

  constructor(data: SlashCommandBuilder | ContextMenuCommandBuilder, execute: (...args: any[]) => any, beta?: boolean) {
    this.beta = beta || false;
    this.data = data;
    this.execute = execute
  }
}