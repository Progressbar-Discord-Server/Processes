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
    emoji: ThingBoardEmojiObject[]
  },

  socials: {
    mastodon: {
      enable: boolean
    }
  },
}

interface ThingBoardEmojiObject {
  emoji: string,
  channelId: string,
  serverId: string,
  number: number,
}
