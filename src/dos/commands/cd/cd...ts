import { DOSCommands } from "../base.js";
import type { Config } from "../../config";

class CdDotDot extends DOSCommands {
  public name = "cd..";
  public execute = async (config: Config) => {
    if (config.depth == 0) return
    config.depth--;
    config.drives.dir.pop();
    if (config.drives.dir.length > 1) config.drives.dir.pop();
    config.drives.S.current = null;
    config.drives.C.current = "";

    return config;
  }
}

export default new CdDotDot();