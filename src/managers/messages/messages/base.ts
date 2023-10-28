import { Message } from "discord.js";

export abstract class BaseMessage {
  public abstract enable: boolean;
  
  public abstract newMessage(message: Message): any;
}