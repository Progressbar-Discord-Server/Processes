import type { Client } from "./Client.js";
import type { Events } from "./events/base.js";
import type { Interaction } from "./interactions/base.js";
import type { DOSCommands } from './dos/commands/base';
import { Collection } from "discord.js";
import { readdir } from "fs/promises";
import { URL, fileURLToPath } from "url";

async function getAllFiles<T>(path: string, array: T[] = []): Promise<Set<T>> {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));

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
    array = Array.from(await getAllFiles(e, array));
  }

  return new Set(array);
}

export async function getAllInteractions() {
  const commands = await getAllFiles<Interaction>("interactions");
  const CollectionCommand = new Collection<string, Interaction>();

  for (const command of commands) {
    CollectionCommand.set(command.name, command);
  }

  return CollectionCommand;
}

export async function getAllEvents(client: Client) {
  const events = await getAllFiles<Events>("events");

  for (const event of events) {
    if (event.once) client.once(event.name, event.execute);
    else if (!event.once) client.on(event.name, event.execute);
  }
}

export async function getAllDOSCommands() {
  const DosCommands = await getAllFiles<DOSCommands>("dos/commands");  
  const CollectionDosCommands = new Collection<string, DOSCommands>()

  for (const DosCommand of DosCommands) {
    if (typeof DosCommand.name === "string") CollectionDosCommands.set(DosCommand.name, DosCommand)
    else if (DosCommand.name instanceof Array) 
      for (const name of DosCommand.name) {
        CollectionDosCommands.set(name, DosCommand)
      }
  }

  return CollectionDosCommands
}