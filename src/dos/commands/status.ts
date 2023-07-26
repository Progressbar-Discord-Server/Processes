import { DOSCommands } from "./base.js";
import type { ExtendedClient } from "../../Client";
import type { Config } from "../config";
import { PresenceStatusData, ActivitiesOptions } from "discord.js";

class Status extends DOSCommands {
  public name = "status";
  public execute = async (config: Config, client: ExtendedClient<true>, args: string[]) => {
    if (!client.isReady()) return;

    if (args.join("").trim() == "") client.user.setActivity()

    const status = args[1]
    const activity = {
      name: args.slice(3).join(" "),
      type: args[2].toUpperCase(),
    }

    if (this.checkActivity(activity)) client.user.setActivity(activity);

    if (this.checkStatus(status)) client.user.setStatus(status);
  }

  checkStatus(status: string): status is PresenceStatusData {
    switch (status) {
      case 'online':
      case 'idle':
      case 'dnd':
      case "invisible":
        return true;
      default: return false;
    }
  }

  checkActivity(activity: Record<any, unknown>): activity is ActivitiesOptions {
    if (!(typeof activity.name === "string" || activity.name === undefined)) return false;
    if (!(typeof activity.url === "string" || activity.url === undefined)) return false;
    
    switch (typeof activity.type) {
      case "string": {
        switch (activity.type.toLowerCase()) {
          case "playing": case "streaming": 
          case "listening": case "watching": 
          case "competing": break;
          default: return false;
        }
        break;
      } 
      case "number": {
        // 4 is custom and invalid in the case of a status.
        if (![1, 2, 3, 5].includes(activity.type)) return false;
        break;
      }
      default: return false
    }

    return true;
  }
}

export default new Status();