import { SlashCommandBuilder, EmbedBuilder, escapeMarkdown, ChatInputCommandInteraction } from 'discord.js';
import { Interaction } from '../../base.js';

class Unban extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('unban')
    .setDescription("Unbans a user")
    .setDMPermission(false)
    .addUserOption(o => o
      .setDescription("The user to unban")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be unbanned?"))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    if (!user) return interaction.reply("No user provided (How did you even do that)");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const replyEmbed = new EmbedBuilder();

    if (!interaction.inGuild()) return interaction.reply("You can't use this command in DMs. (How did you even run it throgh DMs in the first place?)");
    await interaction.deferReply({ ephemeral: true });

    const guild = await interaction.client.guilds.fetch(interaction.guildId);

    await guild.bans.remove(user, reason);
    
    if (reason === "No reason provided") {
      replyEmbed.setColor("#00FF00");
      replyEmbed.setDescription(`**${escapeMarkdown(user.tag)} has been unbanned with the reason:** ${reason}`);
    }
    else if (reason !== "No reason provided") {
      replyEmbed.setDescription(`**${escapeMarkdown(user.tag)} has been unbanned**`);
      replyEmbed.setColor("#00FF00");
    }
    interaction.reply({embeds:[replyEmbed]});
  }
}

export default new Unban();