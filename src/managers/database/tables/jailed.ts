import { TEXT, Sequelize } from "sequelize";

export const name = "jailed";

export function init(database: Sequelize) {
  return database.define('jailed', {
    userID: {
      type: TEXT,
      primaryKey: true
    },
    roles: TEXT
  }, {
    freezeTableName: true
  });
}