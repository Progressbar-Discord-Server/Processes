import type { Client } from "./Client.js";
import type { Command } from "./commands/base.js";
import { Collection } from "discord.js";
import { readdir } from "fs/promises";

export async function load(client: Client) {
  client.commands = new Collection();
  getAllCommands(client, "commands");
}

async function getAllCommands(client: Client, path: string) {
  const filesDir: string[] = await readdir(path);
  const folder: string[] = []

  for (const e of filesDir) {
    const fileData: Command = await import(`${path}/${e}`).catch(() => {return;})
    if (!fileData) {
      folder.push(`${path}/${e}`)
      continue;
    }
 
    client.commands.set(fileData.name, fileData);
  }

  for (const e of folder) {
    await getAllCommands(client, e);
  }
}