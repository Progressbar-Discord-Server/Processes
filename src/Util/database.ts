import Sequelize from 'sequelize';

const conf = (await import("../config.js")).sequelize

const sequelize = new Sequelize.Sequelize(conf.database, conf.username, conf.password, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

export const Star = sequelize.define('message', {
  messageId: {
    type: Sequelize.TEXT,
  },
  messageIdBot: {
    type: Sequelize.TEXT,
    defaultValue: null,
    unique: true,
  },
  emoji: {
    type: Sequelize.TEXT,
  }
})

export const Cases = sequelize.define('cases', {
  userID: {
    type: Sequelize.NUMBER,
  },
  reason: {
    type: Sequelize.TEXT,
    defaultValue: "No reason provided",
  },
  Executor: {
    type: Sequelize.NUMBER,
  },
  type: {
    type: Sequelize.STRING,
  }
});

export const Cards = sequelize.define('cards', {
  userID: {
    type: Sequelize.TEXT,
    unique: true
  },
  Browns: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Yellow: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  White: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Orange: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Red: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Black: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  }
})

export const Reddit = sequelize.define('reddit', {
  Id2: {
    type: Sequelize.TEXT,
    unique: true
  },
})

export const Mastodon = sequelize.define('mastodon', {
  MessageId: {
    type: Sequelize.TEXT,
    unique: true
  }
})