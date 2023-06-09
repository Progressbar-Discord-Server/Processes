import { TEXT, Sequelize } from "sequelize";

export function init(database: Sequelize) {
  return database.define('socials', {
    MessageId: {
      type: TEXT,
      unique: true
    }
  })
}