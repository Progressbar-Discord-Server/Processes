export const name = ["help", "man"]

export async function execute() {
  const print = console.log
  print("Process DOS help")
  print("Commands:\n")
  print("eval <code>                                 Evaluates code")
  print("status <status> <activity> <description>    Changes the status of the bot")
  print("send <channel-id> <message>                 Sends a message on the specified channel")
  print("dir                                         Lists the current directory")
  print("tail <channel-id> [Amount-of-messages]      Lists message in the channel given")
  print("type <file>                                 Show the contents of a file")
  print("cd [directory]                              Change directory")
  print("cls                                         Clears the screen")
  print("echo <text>                                 Displays text on the screen")
  print("help                                        Displays this help")
  print("exit                                        Terminates the bot and console")
  print("reload                                      Reload Command or server, depending on the drive in which executed")
  print("deploy                                      Deploy slash (/) commands")
}