import { ClientEvents } from "discord.js";

export abstract class Events {
  public abstract name: keyof ClientEvents;
  public abstract once: boolean;
  public abstract execute(this: Events, ...args: ClientEvents[typeof this.name]): any;
}