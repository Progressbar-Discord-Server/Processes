import { REST, Routes, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { pathToFileURL } from "url";
import { getAllCommands } from "./GetFiles";

export async function send(commands: RESTPostAPIApplicationCommandsJSONBody[], token: string) {
  const rest = new REST({ version: '10' }).setToken(token);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientId = await rest.get(Routes.user()).then(e => {
    if (typeof e == "object" && e != null && "id" in e && typeof e.id === "string") return e.id;
  })

  if (typeof clientId == "undefined") throw new Error("The client id of the bot couldn't be obtained.");

  console.log(`Started refreshing ${commands.length} interaction commands.`);
  await rest.put(Routes.applicationCommands(clientId), { body: commands }).catch(e => console.error(e));
  console.log(`Successfully reloaded ${commands.length} interaction commands.`);
}

if (import.meta.url !== pathToFileURL(process.argv[1]).href) {
  const { bot: { token } } = await import("./config");
  const commands = (await getAllCommands()).map(e => e.slash.toJSON());

  send(commands, token)
}