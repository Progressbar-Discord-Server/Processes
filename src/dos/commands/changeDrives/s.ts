import { DOSCommands } from "../base.js";
import type { Config } from "../../config";

class S extends DOSCommands {
  public name = ["s:", "S:"];
  public execute = async (config: Config) => {
    config.drives.current = 'S';
    config.drives.S.current = "";
    config.drives.label = 'SERVERS';
    config.depth = 0;
    config.drives.dir = ["\\"];

    return config;
  }
}

export default new S();