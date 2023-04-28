import type { Client } from "../../../Client";
import type { Config } from "../../config";

export const name = ["c:", "C:"];

export async function execute(client: Client, config: Config) {
  config.drives.current = 'C';
  config.drives.C.current = "";
  config.drives.label = 'COMMANDS';
  config.depth = 0;
  config.drives.dir = ["\\"];

  return config;
}