import type { ExtendedClient } from "./Client.js";
import { Collection } from "discord.js";
import { readdir } from "fs/promises";
import { URL, fileURLToPath } from "url";
// Events
import type { Events } from "./events/base.js";
// Interactions
import type { Interaction } from "./interactions/base.js";
// Dos
import type { DOSCommands } from './dos/commands/base';
import { BaseManager } from "./managers/base.js";
// Database

const __dirname = fileURLToPath(new URL(".", import.meta.url));

async function getAllFiles<T, Path extends PropertyKey = "default">(path: string, array: Record<Path, T>[] = [], subdirs = NaN): Promise<Set<Record<Path, T>>> {
  if (subdirs <= -1 && !isNaN(subdirs)) return new Set(array);

  const filesDir: string[] = await readdir(`${__dirname}/${path}`);
  const folders: string[] = []

  for (const e of filesDir) {
    if (e === "base.js") continue;
    const fileData: Record<Path, T> = await import(`${__dirname}/${path}/${e}`).catch(async (err: NodeJS.ErrnoException /*TS Error interface doesn't implement err.code.*/) => {
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
    array = Array.from(await getAllFiles(e, array, subdirs-1));
  }

  return new Set(array);
}

export async function getAllInteractions(log = false) {
  const commandsInteractions = await getAllFiles<Interaction>("interactions/Commands");
  const CollectionCommands = new Collection<string, Interaction>();
  const contextInteractions = await getAllFiles<Interaction>("interactions/ContextMenu")
  const CollectionContext = new Collection<string, Interaction>();

  for (const { default: command } of commandsInteractions) {
    if (command.data.name) CollectionCommands.set(command.data.name, command);
    if (log) console.log(`Initiated Command "${command.data.name}"`)
  }

  for (const { default: context } of contextInteractions) {
    if (context.data.name) CollectionContext.set(context.data.name, context);
    if (log) console.log(`Initiated Context menu "${context.data.name}"`);
  }

  return [CollectionCommands, CollectionContext];
}

export async function getAllEvents(client: ExtendedClient, log = false) {
  const events = await getAllFiles<Events>("events");

  for (const {default: event} of events) {
    if (event.once) client.once(event.name, event.execute.bind(event));
    else if (!event.once) client.on(event.name, event.execute.bind(event));
    if (log) console.log(`Initiated event ${event.name}`)
  }
}

export async function getAllDOSCommands() {
  const DosCommands = await getAllFiles<DOSCommands>("dos/commands");
  const CollectionDosCommands = new Collection<string, DOSCommands>()

  for (const {default: DosCommand} of DosCommands) {
    if (typeof DosCommand.name === "string") CollectionDosCommands.set(DosCommand.name, DosCommand)
    
    else if (DosCommand.name instanceof Array) {
      for (const name of DosCommand.name) {
        CollectionDosCommands.set(name, DosCommand)
      }
    }
  }

  return CollectionDosCommands
}

export async function getAllManagers(client: ExtendedClient, log = false) {
  const managers = await getAllFiles<BaseManager>("managers", [], 1);
  client.managers = {};

  for (const {default: manager} of managers) {
    manager.init(client);
    if (log) console.log(`Loaded manager ${manager.name}`)
  }
}