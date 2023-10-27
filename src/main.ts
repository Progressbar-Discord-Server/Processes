import { Client, GatewayIntentBits , Partials } from "discord.js";
import { ExtendedClient } from "./Client.js";
import { load } from "./load.js";

const client: ExtendedClient = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  presence: {
    status: "idle"
  }
})

load(client);

client.login(client.config ? client.config.bot.token : (await import("./config.js")).bot.token)