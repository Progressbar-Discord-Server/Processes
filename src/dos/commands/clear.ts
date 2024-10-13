import { DOSCommands } from "./base.js";

class Clear extends DOSCommands {
  public name = ["cls", "clear"];
  public execute = async () => console.clear();
}

export default new Clear();