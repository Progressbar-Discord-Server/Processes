import { MessageManager } from "../../managers/messages/init.js";
import { Events } from "../base.js";
import { Message, OmitPartialGroupDMChannel, PartialMessage } from "discord.js";

export default new class MessageCreate extends Events {
  public name = "messageCreate" as const;
  public once = false;

  public async execute(message: OmitPartialGroupDMChannel<Message> | OmitPartialGroupDMChannel<PartialMessage>) {
    if (message.partial) {
      try {
        message = await message.fetch(true);
      } catch {
        return console.warn("Couldn't fetch partial message");
      }
    }

    if (message.client.managers?.message instanceof MessageManager) message.client.managers.message.newMessage(message);
  }
}