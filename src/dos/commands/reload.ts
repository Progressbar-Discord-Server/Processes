import type { Client } from "../../Client";
import type { Config } from "../config";

export async function execute(client: Client, config: Config) {
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
      await getAllInteractions();
      console.log("Reload finished.");
      break
    }
}
}