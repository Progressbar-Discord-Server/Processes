import { REST, Routes } from "discord.js";
import { pathToFileURL } from "url";
import { getAllInteractions } from "./GetFiles.js";
import { bot } from "./config.js";
const { beta: pushBetaCommands } = bot;

export async function send(commands: any[], token: string) {
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
  const { bot: { token } } = await import("./config.js");
  const commands: any[] = [];
  (await getAllInteractions()).forEach(e => e.map(e => {
    const betaStatus = e.beta || false;
    const enable = e.enable || true;
    if (!pushBetaCommands && betaStatus && enable || enable && pushBetaCommands) commands.push(e.data)
  }));

  send(commands, token)
}