import { Client } from "./Client.js";
import { load } from "./load.js";

const client: Client = new Client({intents: ["GuildMessages", "MessageContent", "Guilds"]})

load(client);

client.login((await import("./config.js")).bot.token)