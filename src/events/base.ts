import { Awaitable } from "discord.js";

export interface Events {
  name: string;
  once: boolean;
  
  execute(...args: unknown[]): Awaitable<void>;
}