import { ProcessDOS } from "../../dos/main.js"
import { Events } from "../base.js";
import { errorToEmbed } from "../../util/errorConverter.js";
import { Client } from "discord.js";

export default new class ClientReady extends Events {
  public name = "ready" as const;
  public once = true;

  async execute(client: Client<true>): Promise<void> {
    console.log(`Connected as ${client.user.discriminator !== "#0" ? client.user.username : `${client.user.username}#${client.user.discriminator}`}`);
    ProcessDOS(client);

    try {
      if (client.config?.start) client.config.start(client);
    } catch {
      console.error("Error while running the start function in the config.");
    }
    
    process.on("uncaughtException", (error) => {
      console.error(error);
      if (client.logging?.error) client.logging.error.send({ embeds: [errorToEmbed(error, "uncaughtException")] }).catch();
    });

    process.on("unhandledRejection", (error) => {
      console.error(error);
      if (client.logging?.error) client.logging.error.send({ embeds: [errorToEmbed(error, "unhandledRejection")] }).catch();
    });
  }
}