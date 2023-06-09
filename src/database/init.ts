import type { Model, ModelStatic } from "sequelize";
import Sequelize from 'sequelize';
import { readdir } from "node:fs/promises";
import { Client } from "../Client.js";

export async function dbinit(client: Client) {
  const __dirname = (await import("node:url")).fileURLToPath(new URL(".", import.meta.url));

  const conf = (await import("../config.js")).sequelize

  const database = new Sequelize.Sequelize(conf.database, conf.username, conf.password, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  })

  const tables: Record<string, ModelStatic<Model<any, any>>> = {};

  for (const table of await readdir(`${__dirname}tables`)) {
    const data = await import(`${__dirname}tables/${table}`);

    tables[table.split(".ts")[0]] = await data.init(database);
  }

  client.db = tables;
}