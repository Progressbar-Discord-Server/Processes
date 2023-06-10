import { DOSCommands } from "./base.js"; 
import type { Client } from "../../Client";
import type { Config } from "../config";

export default new DOSCommands("echo", (config: Config, Client: Client, args: string[]) => {
  console.log(args.join(""))
})