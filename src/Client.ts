import type { Command } from "./commands/base.js";
import { Client as djsClient, Collection } from "discord.js";

export class Client extends djsClient {
  commands: Collection<string, Command> = new Collection();
}