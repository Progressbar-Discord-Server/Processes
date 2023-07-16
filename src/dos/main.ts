import type { Client } from '../Client';
import type { Config } from "./config.js"
import { readdir } from 'node:fs/promises';
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from "node:process";
import { getAllDOSCommands } from "../GetFiles.js";

export async function ProcessDOS(client: Client) {
  const commands = await getAllDOSCommands();
  const cmd = createInterface(input, output);
  let config: Config = {
    drives: {
      current: "S",
      S: {
        rootdirs: client.guilds.cache,
        subdirs: null,
        current: ""
      },
      C: {
        rootdirs: await readdir(`${(await import("node:url")).fileURLToPath(new URL(".", import.meta.url))}../interactions`),
        subdirs: null,
        current: ""
      },
      label: "SERVERS",
      dir: ["\\"]
    },
    depth: 0,
    cmd
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, prefer-const
  let object: any = {}
  console.log("The variable 'object' is used for setting a variable inside for use later with the eval command")
  cmd.setPrompt(`${config.drives.current}:${config.drives.dir.join("")}>`)
  cmd.prompt();

  cmd.on('line', async line => {
    const commandName = line.trim().split(" ")[0];
    const command = commands.get(commandName);
    
    if (line.trim() === "eval commands") return console.log(commands)

    if (!command) return console.log("Bad command or file name")

    const maybeConfig = await command.execute(config, client, line.trim().split(" ").slice(1)).catch(console.log)
    
    if (maybeConfig) config = maybeConfig;

    cmd.setPrompt(`${config.drives.current}:${config.drives.dir.join("")}>`)
    cmd.prompt();
  });

  cmd.on("SIGINT", () => {
    cmd.prompt()
  });
}