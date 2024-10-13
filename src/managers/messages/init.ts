import { Message } from "discord.js";
import { BaseManager } from "../base.js";
import { readdir } from "node:fs/promises";
import { URL, fileURLToPath } from "node:url";
import { BaseMessage } from "./messages/base.js";

export class MessageManager extends BaseManager {
  public name = "message";
  #messages: BaseMessage[] = [];

  public async init() {
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const files = await readdir(__dirname + "messages");

    for (const filename of files) {
      const message: BaseMessage = (await import(__dirname  + "messages/" + filename)).default;
      if (!message || !message.enable) continue;
      this.#messages.push(message);
      console.log(`Loaded message ${message.name}`)
    }
  }

  public async newMessage(message: Message) {
    for (const messageConfig of this.#messages) {
      messageConfig.newMessage(message)
    }
  }
}

export default new MessageManager();