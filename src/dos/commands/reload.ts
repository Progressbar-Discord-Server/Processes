import { DOSCommands } from "./base.js";
import type { Client } from "../../Client";
import type { Config } from "../config";

export default new DOSCommands("reload", async (config: Config, client: Client) => {
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
      const [commands, context] = await getAllInteractions();
      const map = new Map()
      map.set("commands", commands)
      map.set("context", context)

      client.interactions = map;
      console.log("Reload finished.");
      break
    }
  }
})