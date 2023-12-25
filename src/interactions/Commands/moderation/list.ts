import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Interaction } from '../../NormalInteraction.js';
import { ExtendedClient } from '../../../Client.js';

class List extends Interaction {
  data = new SlashCommandBuilder()
    .setName('list')
    .setDescription("List bans and kicks and warns and stuff")
    .setDMPermission(false)
    .addSubcommand(sc => sc
      .setName('warns')
      .setDescription('List warns')
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to list warnings (Id)")))
    .addSubcommand(sc => sc
      .setName("bans")
      .setDescription('List bans')
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to list bans (Id)")))
    .addSubcommand(sc => sc
      .setName("kicks")
      .setDescription("List kicks")
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to list kicks")))
    .addSubcommand(sc => sc
      .setName("unban")
      .setDescription("List unbans")
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to list unbans")))
    .addSubcommandGroup(scg => scg
      .setName("jail")
      .setDescription("List jails related actions")
      .addSubcommand(sc => sc
        .setName("added")
        .setDescription("List jails that have been added")
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to list jails added")))
      .addSubcommand(sc => sc
        .setName("removed")
        .setDescription("List jails that have been removed")
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to list jails removed"))))
    .toJSON();

  public beta = false;
  public enable = true;
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.inGuild()) return interaction.followUp("This command cannot be run in DMs.")

    const client: ExtendedClient = interaction.client;

    switch (interaction.options.getSubcommand(true)) {
      case "warns": return this.#checkDB(client, interaction, "warn");
      case "bans": return this.#checkDB(client, interaction, "ban");
      case "kicks": return this.#checkDB(client, interaction, "kick");
      case "unban": return this.#checkDB(client, interaction, "unban");
    }

    switch (interaction.options.getSubcommandGroup()) {
      case "jail": {
        switch (interaction.options.getSubcommand(true)) {
          case "added": return this.#checkDB(client, interaction, "Jail added");
          case "removed": return this.#checkDB(client, interaction, "Jail removed");
        }
      }
    }
  }

  async #checkDB(client: ExtendedClient, interaction: ChatInputCommandInteraction<'cached' | 'raw'>, dbName: "warn" | "kick" | "ban" | "unban" | "Jail added" | "Jail removed") {
    let guild = <Guild>interaction.guild;
    if (!interaction.inCachedGuild()) guild = await client.guilds.fetch(interaction.guildId);

    let IdUser = interaction.user.id;
    const UserExecutor = interaction.user;

    if ((await guild.members.fetch(UserExecutor)).permissions.has(PermissionFlagsBits.KickMembers, true)) IdUser = interaction.options.getUser("user")?.id ?? IdUser;

    const db = client.db?.cases
    if (!db) return interaction.followUp("Database not found.");

    const DB = await db.findAll({
      where: {
        userID: IdUser,
        type: dbName
      },
      attributes: ['id', 'type', 'userID', 'reason', 'Executor', 'createdAt']
    });

    if (DB?.length === 0) return interaction.followUp("Nothing has been found");

    let list = "";

    for (let i = 0; i < DB.length; i++) {
      const date = DB[i].dataValues.createdAt;
      if (date instanceof Date) list += `${DB[i].dataValues.reason} - <t:${Math.floor(date.getTime() / 1000)}:f>\n`;
      else list += `${DB[i].dataValues.reason} - ${date}`;
    }

    interaction.followUp(list);
  }
}

export default new List();