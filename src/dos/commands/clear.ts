import { DOSCommands } from "./base.js";

export default new DOSCommands(["cls", "clear"], async () => console.clear())