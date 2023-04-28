import type { Client } from "../../Client";
import type { Config } from "../config";

export const name = "echo";

export async function execute(client: Client, Config: Config, args: string[]) {
  console.log(args.join(""));
}