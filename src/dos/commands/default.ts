import { DOSCommands } from "./base.js"

class Default extends DOSCommands {
  public name = "";
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public execute = async () => {}
}

export default new Default();