import type { Client } from "../../Client"
import type { Config } from "../config"

export const name = "eval"

export async function execute(client: Client, config: Config, args: string[]) {
  try {
    console.log(await eval(`${args.join(" ")}`))
  } catch (error) {
    console.error(error)
  }
  return config;
}