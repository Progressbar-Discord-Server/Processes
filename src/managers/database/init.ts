import type { Model, ModelStatic } from "sequelize";
import Sequelize from 'sequelize';
import { readdir } from "node:fs/promises";
import { Client } from "discord.js";
import { BaseManager } from "../base.js";

export default new class DatabaseManager extends BaseManager {
  public name = "database";
  public async init(client: Client) {
    const __dirname = (await import("node:url")).fileURLToPath(new URL(".", import.meta.url));

    if (!client.config) return;
    const conf = client.config.sequelize;

    const database = new Sequelize.Sequelize(conf.database, conf.username, conf.password, {
      host: 'localhost',
      dialect: 'mysql',
      logging: false,
    })

    const tables: Record<string, ModelStatic<Model<any, any>>> = {};

    for (const table of await readdir(`${__dirname}tables`)) {
      const data = await import(`${__dirname}tables/${table}`);

      tables[data.name] = await data.init(database);
    }

    client.db = tables;
  }
}