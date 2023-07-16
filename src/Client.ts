import type { Interaction } from "./interactions/base.js";
import { Client as djsClient, Collection, TextChannel } from "discord.js";
import { Model, ModelStatic } from "sequelize"
import PokerManager from "./managers/casino/luigisPoker.js";

export class Client<Ready extends boolean = boolean> extends djsClient<Ready> {
  interactions?: Map<string, Collection<string, Interaction>> = new Collection();
  db?: Record<string, ModelStatic<Model<any, any>>>;
  config?: Config;
  logging?: {
    error: TextChannel;
    moderation: TextChannel;
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
    channel: string,
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