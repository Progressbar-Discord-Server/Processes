import { DOSCommands } from "./base.js"
import type { Client } from "../../Client"
import type { Config } from "../config"

export default new DOSCommands("eval", async (config: Config, client: Client, args: string[]) => {
  try {
    console.log(await eval(`${args.join(" ")}`))
  } catch (error) {
    console.error(error)
  }
  return config;
})