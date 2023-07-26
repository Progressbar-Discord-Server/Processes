import { Client, GatewayIntentBits , Partials } from "discord.js";
import { ExtendedClient } from "./Client.js";
import { load } from "./load.js";

const client: ExtendedClient = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ],
  partials: [
    Partials.Message
  ]
})

load(client);

client.login((await import("./config.js")).bot.token)