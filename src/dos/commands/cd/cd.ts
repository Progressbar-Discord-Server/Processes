import { DOSCommands } from "../base.js";
import type { Client } from "../../../Client";
import type { Config } from "../../config";
import { access } from "node:fs/promises";

export default new DOSCommands("cd", async (config: Config, client: Client, args: string[]) => {
  const newDir = args.join(" ")
  if (newDir === "..") {
    if (config.depth == 0) return
    config.depth--;
    config.drives.dir.pop();
    if (config.drives.dir.length > 1) config.drives.dir.pop();
    config.drives.S.current = null;
    config.drives.C.current = "";
    return config;
  }
  switch (config.drives.current) {
    case 'S': {
      if (config.drives.S.rootdirs &&
        (config.drives.S.rootdirs.find(i => i.name === newDir)
          || config.drives.S.rootdirs.find(i => i.id === newDir)
        )) {
        config.depth++
        if (!isNaN(+newDir)) {
          const server = client.guilds.cache.find(g => g.id === newDir)
          if (!server) break;
          config.drives.S.current = server.id
          config.drives.dir.push(server.name)
        }
        else if (isNaN(+newDir)) {
          const server = client.guilds.cache.find(g => g.name === newDir)
          if (!server) break;
          config.drives.S.current = server.id
          config.drives.dir.push(server.name)
        }
      } else {
        console.log("Invalid directory")
      }
      break
    }
    case 'C': {
      if (!config.depth && config.drives.C.rootdirs.find(i => i === newDir)) {
        if (config.drives.dir.length > 1) config.drives.dir.push("\\")
        config.drives.dir.push(newDir)
        config.depth++
        config.drives.C.current += newDir.endsWith("/") ? newDir : newDir + "/"
        break;
      }

      try {
        await access(`${(await import("node:url")).fileURLToPath(new URL(".", import.meta.url))}/../../../interactions/${config.drives.C.current}`)
        if (config.drives.dir.length > 1) config.drives.dir.push("\\")
        config.drives.dir.push(newDir)
        config.depth++
        config.drives.C.current += newDir.endsWith("/") ? newDir : newDir + "/"
        return config;
      } catch {
        console.log("Invalid directory")
      }
    }
  }
})