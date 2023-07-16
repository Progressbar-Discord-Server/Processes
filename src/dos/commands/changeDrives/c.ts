import { DOSCommands } from "../base.js";
import type { Config } from "../../config";

class C extends DOSCommands {
  public name = ["c:", "C:"];
  public execute = async (config: Config) => {
  config.drives.current = 'C';
  config.drives.C.current = "";
  config.drives.label = 'COMMANDS';
  config.depth = 0;
  config.drives.dir = ["\\"];

  return config;
}
}

export default new C();