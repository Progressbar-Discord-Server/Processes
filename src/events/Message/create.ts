import { Events } from "../base.js";
import { Events as Event, Message } from "discord.js";

export default new class MessageCreate extends Events {
  public name = Event.MessageCreate;
  public once = false;

  public execute(message: Message) {
    message
  }
}