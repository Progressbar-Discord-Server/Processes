import { DOSCommands } from "../base.js";
import type { Config } from "../../config";

export default new DOSCommands(["s:", "S:"], (config: Config) => {
  config.drives.current = 'S';
  config.drives.S.current = "";
  config.drives.label = 'SERVERS';
  config.depth = 0;
  config.drives.dir = ["\\"];

  return config;
})