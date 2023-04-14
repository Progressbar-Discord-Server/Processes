import type { Client } from '../Client';
import { CategoryChannel, Collection, ForumChannel, Guild, PartialGroupDMChannel, RESTPostAPIApplicationCommandsJSONBody, PresenceStatusData } from 'discord.js';
import { readdirSync, readFile } from 'node:fs';
import { createInterface } from 'readline';
import { stdin as input, stdout as output, env, exit } from "node:process";

interface drvS {
  rootdirs?: Collection<string, Guild> | null,
  subdirs?: Guild | undefined | null,
}

interface drvC {
  rootdirs?: string[],
  subdirs?: string[] | Collection<unknown, unknown> | null,
}

export async function ProcessDOS(client: Client) {
  const cmd = createInterface(input, output);

  let drive: "S" | "C" = "S"
  let dir = ["\\"]
  let drvlabel = "SERVERS"
  let depth = 0
  let curServer: string | null = null
  let curC: string | null = null
  const drvS: drvS = {}
  const drvC: drvC = {}
  const inRepl = false

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const object = {}
  let pm2 = false
  if (env.PM2_USAGE) pm2 = true
  console.log("The object 'object' is used for setting a variable inside for use later with the eval command")
  drvS.rootdirs = client.guilds.cache
  drvS.subdirs = null
  drvC.rootdirs = readdirSync(`${__dirname}/../commands`);
  drvC.subdirs = null
  //console.log(paths)
  cmd.setPrompt(`${drive}:${dir.join("")}>`)
  cmd.prompt();

  cmd.on('line', async line => {
    if (inRepl) return
    switch (line.trim().split(" ")[0]) {
      case 'exit': {
        if (!pm2) {
          cmd.close()
          client.destroy()
          exit(0)
        }
        else if (pm2) console.log("You are using pm2, to exit the command line, use Ctrl+C.\nIf you want to reload command file, use reload in the C: drive")
        break
      }
      case 'eval': {
        try {
          console.log(await eval(`${line.substring(4)}`))
        } catch (error) {
          console.error(error)
        }
        break
      }
      case 'help': case 'man': {
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
        break
      }
      case 'status': {
        if (line.trim() == "status") { client.user?.setActivity() }

        const status = line.split(" ")[1]
        const activity = parseInt(line.split(" ")[2].toUpperCase())
        const description = line.split(" ").slice(3).join(" ")

        client.user?.setActivity(description, { type: activity });
        if (status instanceof PresenceStatusData) client.user?.setStatus(status);

        break
      }
      case 'dir': case 'ls': {
        console.log(`\n Volume in drive ${drive} is ${drvlabel}`)
        console.log(` Volume Serial Number is 298A-E8CC`)
        console.log(` Directory of ${drive}:${dir.join("")}\n`)
        switch (drive) {
          case 'S': {
            if (depth == 0) {
              if (!drvS.rootdirs) break;

              for (const [, i] of drvS.rootdirs) {
                if (i.name == undefined) await i.fetch()
                console.log(i.name.padEnd(20) + ` (${i.id})`.padEnd(23) + "<DIR>      ")
              }
            } else {
              drvS.subdirs = client.guilds.cache.get(`${curServer}`)
              if (!drvS.subdirs) break;
              drvS.subdirs.channels.cache.forEach(c => console.log(`${c.id.padEnd(19)} ${c.name.substring(0, 15).padEnd(16)} CHN`))
            }
          }
            break
          case 'C': {
            if (depth == 0) {
              if (!drvC.rootdirs) break;
              for (const i of drvC.rootdirs) {
                console.log(i.padEnd(20) + "<DIR>      ")
              }
            } else {
              drvC.subdirs = readdirSync(`${__dirname}/../commands/${curC}`);
              drvC.subdirs.forEach(c => console.log(`${c.substring(0, 15).padEnd(16)} FILE`))
            }
          }
        }
        break
      }
      case 'cd': case 'cd..': {
        const newDir = line.split(" ").slice(1).join(" ")
        if (newDir === ".." || line.split(" ")[0] === "cd..") {
          if (depth == 0) break
          depth--
          dir.pop()
          curServer = null
          curC = null
          break
        }
        switch (drive) {
          case 'S': {
            if (drvS.rootdirs && (drvS.rootdirs.find(i => i.name === newDir) || drvS.rootdirs.find(i => i.id === newDir))) {
              depth++
              if (!isNaN(+newDir)) {
                const server = client.guilds.cache.find(g => g.id === newDir)
                if (!server) break;
                curServer = server.id
                dir.push(server.name)
              }
              else if (isNaN(+newDir)) {
                const server = client.guilds.cache.find(g => g.name === newDir)
                if (!server) break;
                curServer = server.id
                dir.push(server.name)
              }
            } else {
              console.log("Invalid directory")
            }
            break
          }
          case 'C': {
            if (drvC.rootdirs && drvC.rootdirs.find(i => i === newDir)) {
              dir.push(newDir)
              depth++
              curC = newDir
            } else {
              console.log("Invalid directory")
            }
          }
        }
        break
      }
      case 'cls': case 'clear': {
        console.clear();
        break
      }
      case 'send': {
        const channel = await client.channels.fetch(line.split(" ")[1]);
        if (!channel) break;
        if (
          channel instanceof CategoryChannel ||
          channel instanceof PartialGroupDMChannel ||
          channel instanceof ForumChannel
        ) break;
        channel.send(line.split(" ").slice(2).join(" "))
        break
      }
      case 'echo': {
        console.log(line.split(" ").slice(1).join(""))
        break
      }
      case 'tail': {
        if (drive === "C" || curServer == null) { console.log("Please, enter a server in the 'S' drive"); break }
        const channel = line.split(" ")[1]
        if (!channel) { console.log('A channel id is required'); break }
        const MessageAmount: number = parseInt(line.split(" ")[2]) || 10
        const server = (await client.guilds.fetch(curServer)).channels.cache.get(channel);
        if (!server) break;
        if (server instanceof CategoryChannel) break;
        const Messages = await server.messages.fetch({ limit: MessageAmount })
        Messages.forEach(e => {
          console.log(`${e.id.padEnd(20)}${e.author.tag.padEnd(13)}${e.content}`)
        })
        break
      }
      case 'type': case 'cat': {
        const file = line.split(" ").slice(1).join(" ")
        if (!file) { console.log('Required parameter missing'); break }
        cmd.setPrompt(" ")
        switch (drive) {
          case 'S': {
            console.log('General failure reading drive S:')
            console.log('Abort, Retry, Fail?a')
            break
          }
          case 'C':
            readFile(`${__dirname}/../commands/${curC}/${file.toLowerCase()}`, 'utf8', (err, data) => {
              if (err) { console.log(`File not found - ${file.toLowerCase()}`); return }
              console.log(data)
            })
        }
        console.log()
        break
      }
      case "reload": {
        switch (drive) {
          case "S": {
            console.log("Reloading servers, Please wait...")
            await client.guilds.fetch()
            drvS.rootdirs = client.guilds.cache
            console.log("Reload finished")
            break
          }
          case "C": {
            /*
            const { ReloadJsFile } = require('./GetJSFile.js');
            console.log("Reloading commands, Please wait...");
            await ReloadJsFile(client);
            console.log("Reload finished.");
            */
            break
          }
        }
        break
      }
      case "deploy": {
        const { send } = await import("../deployCommand.js");
        const { bot: { beta } } = await import("../config.js");

        const all: RESTPostAPIApplicationCommandsJSONBody[] = []
        if (client.commands) client.commands.forEach(e => { if (!beta && e.name !== "test" || beta) all.push(e.slash.toJSON()) })

        if (client.contextMenu) client.contextMenu.forEach(e => all.push(e.data.toJSON()))

        send(all, client.token ? client.token : (await import("../config.js")).bot.token);
        break;
      }
      case 'c:': case 'C:': {
        drive = 'C'
        drvlabel = 'COMMANDS'
        depth = 0
        dir = ["\\"]
        break
      }
      case 's:': case 'S:': {
        drive = 'S'
        drvlabel = 'SERVERS'
        depth = 0
        dir = ["\\"]
        break
      }
      case '': break
      default: console.log("Bad command or file name")
    }
    cmd.setPrompt(`${drive}:${dir.join("")}>`)
    cmd.prompt();
  });

  cmd.on("SIGINT", () => {
    cmd.prompt()
  });
}