import { DOSCommands } from "./base.js";
import type { ExtendedClient } from "../../Client";
import type { Config } from "../config";

class Reload extends DOSCommands {
  public name = "reload";
  public execute = async (config: Config, client: ExtendedClient) => {
    switch (config.drives.current) {
      case "S": {
        console.log("Reloading servers, Please wait...")
        await client.guilds.fetch()
        config.drives.S.rootdirs = client.guilds.cache
        console.log("Reload finished")
        break
      }
      case "C": {
        const { getAllInteractions } = await import('../../GetFiles.js');
        console.log("Reloading commands, Please wait...");
        const [commands, context, modal] = await getAllInteractions();
        client.interactions = {
          commands,
          context,
          modal
        };
        
        console.log("Reload finished.");
        break
      }
    }
  }
}
export default new Reload();