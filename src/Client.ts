import type { Interaction } from "./interactions/base.js";
import { Client, Collection, TextChannel } from "discord.js";
import { Model, ModelStatic } from "sequelize"
import PokerManager from "./managers/casino/luigisPoker.js";

export type ExtendedClient<Ready extends boolean = boolean> = Client<Ready> & {
  interactions?: Map<string, Collection<string, Interaction>>;
  db?: Record<string, ModelStatic<Model<any, any>>>;
  config?: Config;
  logging?: {
    error?: TextChannel;
    moderation?: TextChannel;
  };
  managers?: Managers;
}


interface Managers {
  poker: PokerManager;
}

export interface Config {
  bot: {
    token: string,
    beta: boolean
  },
  sequelize: {
    database: string,
    username: string,
    password: string,
  }
  logging: {
    error: string,
    moderation: string
  }
  casino: {
    enable: boolean,
    cardsToEmbed: {
      star: string,
      mario: string,
      luigi: string,
      fire: string,
      mush: string,
      cloud: string,
    },
    luigiHideCard: string,
  }
}