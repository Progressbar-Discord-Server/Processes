import { Client, GatewayIntentBits , Partials } from "discord.js";
import { load } from "./load.js";

const client = new Client({
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

client.token = client.config ? client.config.bot.token : (await import("./config.js")).bot.token;
client.login()

await load(client);