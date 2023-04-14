import type { Client } from "./Client.js";
import type { Events } from "./events/base.js";
import type { Command } from "./commands/base.js";
import { Collection } from "discord.js";
import { readdir } from "fs/promises";
import { URL, fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

async function getAllFiles<T>(path: string, array: T[] = []): Promise<Set<T>> {
  const filesDir: string[] = await readdir(`${__dirname}/${path}`);
  const folders: string[] = []

  for (const e of filesDir) {
    if (e === "base.js") continue;
    const fileData: T = await import(`${__dirname}/${path}/${e}`).catch(async (err: NodeJS.ErrnoException /*TS Error interface doesn't implement err.code.*/) => {
      switch (err.code) {
        case "ERR_UNSUPPORTED_DIR_IMPORT": {
          break;
        }
        default: throw err;
      }
    });

    if (!fileData) folders.push(`${path}/${e}`);
    else if (fileData) array.push(fileData)
  }

  for (const e of folders) {
    const files = Array.from(await getAllFiles(e, array));
    array = array.concat(files);
  }

  return new Set(array);
}

export async function getAllCommands(): Promise<Collection<string, Command>> {
  const commands = await getAllFiles<Command>("commands");
  const CollectionCommand = new Collection<string, Command>();

  for (const command of commands) {
    CollectionCommand.set(command.name, command);
  }

  return CollectionCommand;
}

export async function getAllEvents(client: Client): Promise<void> {
  const events = await getAllFiles<Events>("events");

  for (const event of events) {
    if (event.once) client.once(event.name, event.execute);
    else if (!event.once) client.on(event.name, event.execute);
  }
}