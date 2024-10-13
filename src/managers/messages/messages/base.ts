import { Message } from "discord.js";

export abstract class BaseMessage {
  public abstract enable: boolean;
  public abstract name: string;

  public abstract newMessage(message: Message): any;
}