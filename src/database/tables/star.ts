import { TEXT, Sequelize } from "sequelize";

export function init(database: Sequelize) {
  return database.define('star', {
    messageId: {
      type: TEXT,
    },
    messageIdBot: {
      type: TEXT,
      defaultValue: null,
      unique: true,
    },
    emoji: {
      type: TEXT,
    }
  })
}