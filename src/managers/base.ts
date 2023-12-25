import type { Interaction } from "../interactions/NormalInteraction.js";
import type { DOSCommands } from "../dos/commands/base.js";
import { ExtendedClient } from "../Client";
import { Events } from "../events/base";

export abstract class BaseManager {
  public abstract name: string;
  public abstract init(this: BaseManager, client: ExtendedClient): any;
  
  // Unused for now
  public dos: DOSCommands[] = [];
  public events: Events[] = [];
  public interactions: Interaction[] = [];
}