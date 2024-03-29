import { BaseInteraction } from "./interactions/BaseInteraction.js";
import { Client, Collection, TextChannel } from "discord.js";
import { Model, ModelStatic } from "sequelize"
import { BaseManager } from "./managers/base.js";
import { BaseConfig } from "./baseConfig.js";

export type ExtendedClient<Ready extends boolean = boolean> = Client<Ready> & {
  interactions?: InteractionMaps;
  db?: Record<string, ModelStatic<Model<any, any>>>;
  config?: BaseConfig;
  logging?: {
    error?: TextChannel;
    moderation?: TextChannel;
  };
  managers?: Record<string, BaseManager>;
}

interface InteractionMaps {
  commands: Collection<string, BaseInteraction>;
  context: Collection<string, BaseInteraction>;
  modal: {
    name: Collection<string, BaseInteraction<true>>;
    startWith: Collection<string, BaseInteraction<false>>;
  };
}