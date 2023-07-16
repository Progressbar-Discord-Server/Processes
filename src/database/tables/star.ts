import { TEXT, Sequelize } from "sequelize";

export const name = "star";

export function init(database: Sequelize) {
  return database.define('star', {
    messageId: {
      type: TEXT,
      unique: true,
      primaryKey: true
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