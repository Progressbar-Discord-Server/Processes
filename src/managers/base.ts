import type { Interaction } from "../interactions/NormalInteraction.js";
import type { DOSCommands } from "../dos/commands/base.js";
import { Events } from "../events/base";
import { Client } from "discord.js";

export abstract class BaseManager {
  public abstract name: string;
  public abstract init(this: BaseManager, client: Client): any;
  
  // Unused for now
  public dos: DOSCommands[] = [];
  public events: Events[] = [];
  public interactions: Interaction[] = [];
}