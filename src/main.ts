import { Client, IntentsBitField, Partials } from "discord.js";
import { ExtendedClient } from "./Client.js";
import { load } from "./load.js";

const client: ExtendedClient = new Client({intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.Guilds], partials: [Partials.Message]})

load(client);

client.login((await import("./config.js")).bot.token)