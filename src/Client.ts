import { BaseInteraction as MyBaseInteraction } from "./interactions/BaseInteraction.js";
import { Collection } from "discord.js";
import { Model, ModelStatic } from "sequelize"
import { BaseManager as MyBaseManager } from "./managers/base.js";
import { BaseConfig } from "./baseConfig.js";

declare module "discord.js" {
  interface Client {
    interactions: InteractionMaps;
    db: Record<string, ModelStatic<Model<any, any>>>;
    config: BaseConfig;
    logging: {
      error?: TextChannel;
      moderation?: TextChannel;
    };
    managers: Record<string, MyBaseManager>;
  }

  interface InteractionMaps {
    commands: Collection<string, MyBaseInteraction>;
    context: Collection<string, MyBaseInteraction>;
    modal: {
      name: Collection<string, MyBaseInteraction<true>>;
      startWith: Collection<string, MyBaseInteraction<false>>;
    };
  }
}
