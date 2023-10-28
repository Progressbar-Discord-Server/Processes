import { Message } from "discord.js";
import { BaseMessage } from "./base.js";

export class Reddit extends BaseMessage {
  public enable = true;
  
  public newMessage(message: Message) {
    if (message.author.id !== "282286160494067712") return;

    const title = message.embeds[0]?.title ?? "Couldn't obtain embed title.";
    message.startThread({name: title.length > 100 ? title.slice(0, 97) + "..." : title})
  }
}

export default new Reddit();