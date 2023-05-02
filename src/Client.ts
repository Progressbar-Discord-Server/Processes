import type { Interaction } from "./interactions/base.js";
import { Client as djsClient, Collection } from "discord.js";
import { Model, ModelStatic } from "sequelize"

export class Client extends djsClient {
  interactions?: Collection<string, Interaction> = new Collection();
  db?: Record<string, ModelStatic<Model<any, any>>>
}