import type { Client } from "../../../Client";
import type { Config } from "../../config";

export const name = "cd.."

export async function execute(client: Client, config: Config) {
  if (config.depth == 0) return
  config.depth--;
  config.drives.dir.pop();
  if (config.drives.dir.length > 1) config.drives.dir.pop();
  config.drives.S.current = undefined;
  config.drives.C.current = "";

  return config;
}