import { DOSCommands } from "../base.js";
import type { Config } from "../../config";

export default new DOSCommands(["c:", "C:"], async (config: Config) => {
  config.drives.current = 'C';
  config.drives.C.current = "";
  config.drives.label = 'COMMANDS';
  config.depth = 0;
  config.drives.dir = ["\\"];

  return config;
})