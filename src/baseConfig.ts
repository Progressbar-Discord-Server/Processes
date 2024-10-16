import { Client, RoleResolvable } from "discord.js";

export interface BaseConfig {
  bot: {
    token: string,
    beta: boolean
  },

  sequelize: {
    database: string,
    username: string,
    password: string,
  },

  logging: {
    moderation: string;
  },

  ownersIds: string[],

  pastee: {
    key: string
  },

  thingboard: {
    enable: boolean,
    emoji: ThingBoardEmoji[]
  },

  socials: {
    enable: boolean;
    emojis: EmojiObject[];
    socials: {
      [key: string]: {
        enable: boolean;
        config?: ImplementationConfig;
      } | undefined;
    }
  },

  start?: (client: Client) => any;

  jail: {
    givenRole: RoleResolvable;
    protectorRole: RoleResolvable;
  },

  wallpaper: {
    allowed: string[],
  }
}

export interface EmojiObject {
  emoji: string,
  number: number,
}

export interface ThingBoardEmoji extends EmojiObject {
  channelId: string,
  serverId: string,
}

export type ImplementationConfig = Record<string, unknown> | undefined;
