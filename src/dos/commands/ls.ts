import { DOSCommands } from "./base.js";
import type { Client } from "../../Client";
import type { Config } from "../config";
import { readdir } from "node:fs/promises";

export default new DOSCommands(["dir", "ls"], async (config: Config, client: Client) => {
  console.log(`\n Volume in drive ${config.drives.current} is ${config.drives.label}`)
  console.log(` Volume Serial Number is 298A-E8CC`)
  console.log(` Directory of ${config.drives.current}:${config.drives.dir.join("")}\n`)
  switch (config.drives.current) {
    case 'S': {
      if (config.depth == 0) {
        if (!config.drives.S.rootdirs) break;

        for (const [, i] of config.drives.S.rootdirs) console.log(i.name.padEnd(20) + ` (${i.id})`.padEnd(23) + "<DIR>      ");
        break;
      }
      config.drives.S.subdirs = await client.guilds.fetch(`${config.drives.S.current}`)
      if (!config.drives.S.subdirs) break;
      config.drives.S.subdirs.channels.cache.forEach(c => console.log(`${c.id.padEnd(19)} ${c.name.substring(0, 15).padEnd(16)} CHN`));

      break;
    }
    case 'C': {
      if (config.depth == 0) {
        if (!config.drives.C.rootdirs) break;
        for (const i of config.drives.C.rootdirs) {
          console.log(i.padEnd(20) + "<???>      ");
        }
        break;
      }

      config.drives.C.subdirs = await readdir(`${(await import("node:url")).fileURLToPath(new URL(".", import.meta.url))}/../../interactions/${config.drives.C.current}`);
      config.drives.C.subdirs.forEach(c => console.log(`${c.substring(0, 15).padEnd(16)} ???`));
      break;
    }
  }
})