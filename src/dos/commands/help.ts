import { DOSCommands } from "./base.js"

export default new DOSCommands(["help", "man"], async () => {
  const log = console.log
  log("Process DOS help")
  log("Commands:\n")
  log("eval <code>                                 Evaluates code")
  log("status <status> <activity> <description>    Changes the status of the bot")
  log("send <channel-id> <message>                 Sends a message on the specified channel")
  log("dir                                         Lists the current directory")
  log("tail <channel-id> [Amount-of-messages]      Lists message in the channel given")
  log("type <file>                                 Show the contents of a file")
  log("cd [directory]                              Change directory")
  log("cls                                         Clears the screen")
  log("echo <text>                                 Displays text on the screen")
  log("help                                        Displays this help")
  log("exit                                        Terminates the bot and console")
  log("reload                                      Reload Command or server, depending on the drive in which executed")
  log("deploy                                      Deploy slash (/) commands")
});