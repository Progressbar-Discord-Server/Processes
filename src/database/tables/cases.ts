import { NUMBER, TEXT, STRING, Sequelize } from "sequelize";

export function init(database: Sequelize) {
  return database.define('cases', {
    userID: {
      type: NUMBER,
    },
    reason: {
      type: TEXT,
      defaultValue: "No reason provided",
    },
    Executor: {
      type: NUMBER,
    },
    type: {
      type: STRING,
    }
  });
}