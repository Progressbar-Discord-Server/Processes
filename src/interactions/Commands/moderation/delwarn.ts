import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, InteractionContextType } from 'discord.js';
import { Client } from "discord.js";
import { Interaction } from "../../NormalInteraction.js";

class Delogs extends Interaction{
  public data = new SlashCommandBuilder()
    .setName('delogs')
    .setDescription("Delete a case")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts(InteractionContextType.Guild)
    .addNumberOption(o => o
      .setName("case")
      .setDescription("Which case need to be deleted?")
      .setRequired(true))
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    const client: Client = interaction.client;
    const id = interaction.options.getNumber("case", true);
    await interaction.deferReply({ ephemeral: true });
    const deletedRows = await client.db?.cases.destroy({ where: { id: id } });

    const embed = new EmbedBuilder()
      .setTitle("Deleted")
      .setDescription(`Case ${id} deleted`)
      .setTimestamp(new Date())
      .setColor([0, 255, 0]);

    if (!deletedRows) {
      embed.setTitle("Couldn't find the database")
        .setDescription(`Case ${id} couldn't be deleted`)
        .setColor([255, 0, 0]);

      return interaction.followUp({ embeds: [embed] });
    }

    interaction.followUp({ embeds: [embed] });
  }
}

export default new Delogs();