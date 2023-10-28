import { ExtendedClient } from "../../Client.js";
import { MessageManager } from "../../managers/messages/init.js";
import { Events } from "../base.js";
import { Message, PartialMessage } from "discord.js";

export default new class MessageCreate extends Events {
  public name = "messageCreate" as const;
  public once = false;

  public async execute(message: Message | PartialMessage) {
    const mes = message.partial ? await message.fetch() : message;
    const client: ExtendedClient = message.client;

    if (client.managers?.message instanceof MessageManager) client.managers.message.newMessage(mes);
  }
}