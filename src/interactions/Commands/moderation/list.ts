import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Interaction } from '../../base.js';
import { ExtendedClient } from '../../../Client.js';

class List extends Interaction {
  data = new SlashCommandBuilder()
    .setName('list')
    .setDescription("List bans and kicks and warns and stuff")
    .setDMPermission(false)
    .addSubcommand(sc => sc
      .setName('warns')
      .setDescription('List warns')
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list warnings (Id)")))
    .addSubcommand(sc => sc
      .setName("bans")
      .setDescription('List bans')
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list bans (Id)")))
    .addSubcommand(sc => sc
      .setName("kicks")
      .setDescription("List kicks")
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list kicks (Id)")))
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const client: ExtendedClient = interaction.client;

    switch (interaction.options.getSubcommand(true)) {
      case "warns": {
        return this.#checkDB(client, interaction, "warn");
      }
      case "bans": {
        return this.#checkDB(client, interaction, "bans");
      }
      case "kicks": {
        return this.#checkDB(client, interaction, "kick");
      }
    }
  }

  async #checkDB(client: ExtendedClient, interaction: ChatInputCommandInteraction, dbName: "warn" | "kick" | "bans") {
    let guild: Guild;
    if (!interaction.inGuild()) return interaction.followUp("You can't use this command in DMs.");
    if (interaction.inCachedGuild()) guild = interaction.guild
    else guild = await client.guilds.fetch(interaction.guildId);

    let IdUser = interaction.options.getString("user");
    const UserExecutor = interaction.user;

    if (IdUser) {
      const permV = await guild.members.fetch(UserExecutor);
      if (!permV.permissions.has(PermissionFlagsBits.KickMembers)) {
        return interaction.reply("I'm sorry Dave, but i'm afraid i can't do that\nYou do not have the permission to do that");
      }
    }
    else if (!IdUser) {
      IdUser = interaction.user.id;
    }

    const db = client.db?.cases
    if (!db) return interaction.followUp("Database not found.");

    const warnDB = await db.findAll({
      where: {
        userID: IdUser,
        type: dbName
      },
      attributes: ['id', 'type', 'userID', 'reason', 'Executor']
    });

    let list = "";
    for (let i = 0; i < warnDB.length; i++) {
      list += `${warnDB[i].dataValues.reason} - *insert date here*\n`;
    }
    console.log(list);

    if (list.length === 0) {
      return interaction.followUp({ content: list });
    }

    interaction.followUp({ content: `There is no ${dbName}` });
  }
}

export default new List();