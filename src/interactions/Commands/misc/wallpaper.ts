import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Interaction } from "../../NormalInteraction.js";
import { ExtendedClient } from "../../../Client.js";

class Wallpaper extends Interaction {
  #lastUse = new Date(0);

  public data = new SlashCommandBuilder()
    .setName("wallpaper")
    .setDescription("Pings wallpaper'd, can be run once per day")
    .setDefaultMemberPermissions('0')
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    const client: ExtendedClient = interaction.client;
    const config = client.config?.wallpaper;

    if (!config?.allowed.includes(interaction.user.id)) {
      return await interaction.reply({
        content: "You are not allowed to run this command.",
        ephemeral: true,
      });
    }

    if (this.#lastUse.getTime() > new Date().getTime()) {
      return await interaction.reply({
        content: `This command is limited to be run once a day server wide.\nYou can execute this command again <t:${Math.floor(this.#lastUse.getTime() / 1000)}:R>`,
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: "<@&1153713381421883514>",
      allowedMentions: {
        roles: ["1153713381421883514"]
      }
    });

    this.#lastUse = new Date(Date.now());
    this.#lastUse.setDate(this.#lastUse.getDate()+1);
  }
}

export default new Wallpaper();