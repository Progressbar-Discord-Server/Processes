import { MessageReaction, PartialMessageReaction, User } from "discord.js";
import { ExtendedClient } from "../../Client";
import { BaseManager } from "../base.js";
import { readdir } from "node:fs/promises";
import { URL, fileURLToPath } from "node:url";
import { Social } from "./implementations/base";

export class SocialsManager extends BaseManager {
  public name = "socials";

  #socials: Social[] = [];
  public async init(this: SocialsManager, client: ExtendedClient) {
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const files = await readdir(__dirname + "implementations");

    for (const file of files) {
      const social: Social = (await import(__dirname + "implementations/" + file)).default
      if (!social || !social.name) continue;

      const config = client.config?.socials.socials[social.name];
      if (!config || !(config.enable && await social.checkExtendedConfig(config.config))) continue;

      social.init(config.config);
      this.#socials.push(social);
      
      console.log(`Loaded Social ${social.name}`)
    }
  }

  public async check(reaction: MessageReaction | PartialMessageReaction, user: User) {
    const rec = !reaction.partial ? reaction : await reaction.fetch();
    const client: ExtendedClient = rec.client;
    const config = client.config?.socials.socials;
    if (!config) return;
    if (!this.#checkReaction(rec, user)) return;

    const db = client.db?.socials;
    if (db) {
      const [, created] = await db.findOrCreate({where: {MessageId: rec.message.id}});
      if (!created) return;
    }

    for (const social of this.#socials) {
      social.send(config[social.name], rec.message);
    }
  }

  #checkReaction(reaction: MessageReaction, author: User): boolean {
    const client: ExtendedClient = reaction.client;
    const config = client.config?.socials;

    if (!config) return false;
    const emojiConfig = config.emojis.find(value => value.emoji == reaction.emoji.name);
    if (!emojiConfig) return false;
    
    let count = reaction.count;
    for (const [, user] of reaction.users.cache) if (user.bot || (author && author.id === user.id)) count--;
    
    if (count < emojiConfig.number) return false;

    return true;
  }
}

export default new SocialsManager();