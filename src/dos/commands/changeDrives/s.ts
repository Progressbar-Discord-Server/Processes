import type { Client } from "../../../Client";
import type { Config } from "../../config";

export const name = ["s:", "S:"];

export async function execute(client: Client, config: Config) {
  config.drives.current = 'S';
  config.drives.S.current = "";
  config.drives.label = 'SERVERS';
  config.depth = 0;
  config.drives.dir = ["\\"];

  return config;
}