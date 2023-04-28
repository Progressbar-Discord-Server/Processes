import type { Config } from "../config"
import type { Client } from "../../Client"
import { env, exit } from "node:process"

export const name = "exit"

export async function execute(client: Client, config: Config) {
  if (!env.PM2_USAGE) {
    config.cmd.close()
    client.destroy()
    exit(0)
  }
  console.log("You are using pm2, to exit the command line, use Ctrl+C.\nIf you want to reload command file, use reload in the C: drive");
  return config;
}