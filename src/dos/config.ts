import type { Collection, Guild} from "discord.js"
import type { Interface } from "readline/promises";

interface drvS {
  rootdirs: Collection<string, Guild>,
  subdirs: Guild | null,
  current: string | null
}

interface drvC {
  rootdirs: string[],
  subdirs: string[] | null,
  current: string
}

export interface Config {
  drives: {
    current: "S" | "C",
    S: drvS,
    C: drvC,
    label: "SERVERS" | "COMMANDS",
    dir: string[]
  }

  depth: number,
  cmd: Interface
}