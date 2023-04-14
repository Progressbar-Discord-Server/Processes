import type { Command } from "./commands/base.js";
import type { ContextMenu } from "./contextMenu/base.js"
import { Client as djsClient, Collection } from "discord.js";

export class Client extends djsClient {
  commands?: Collection<string, Command> = new Collection();
  contextMenu?: Collection<string, ContextMenu> = new Collection();
}