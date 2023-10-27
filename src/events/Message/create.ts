import { Events } from "../base.js";
import { Message } from "discord.js";

export default new class MessageCreate extends Events {
  public name = "messageCreate" as const;
  public once = false;

  public execute(message: Message) {
    message
  }
}