import { TEXT, STRING, Sequelize } from "sequelize";

export const name = "cases";

export function init(database: Sequelize) {
  return database.define('cases', {
    userID: TEXT,
    reason: {
      type: TEXT,
      defaultValue: "No reason provided",
    },
    Executor: TEXT,
    type: STRING
  });
}