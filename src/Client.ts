import type { Interaction } from "./interactions/base.js";
import { Client, Collection, TextChannel } from "discord.js";
import { Model, ModelStatic } from "sequelize"
import { BaseManager } from "./managers/base.js";
import { BaseConfig } from "./baseConfig.js";

export type ExtendedClient<Ready extends boolean = boolean> = Client<Ready> & {
  interactions?: Map<string, Collection<string, Interaction>>;
  db?: Record<string, ModelStatic<Model<any, any>>>;
  config?: BaseConfig;
  logging?: {
    error?: TextChannel;
    moderation?: TextChannel;
  };
  managers?: Record<string, BaseManager>;
}
