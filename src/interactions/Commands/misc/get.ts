import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Interaction } from '../../NormalInteraction.js';
import axios from 'axios';
import { Client } from 'discord.js';

class Get extends Interaction {
  public data = new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .setDMPermission(false)
    .addSubcommandGroup(scg => scg.setName("role")
      .setDescription("Getting info about roles")
      .addSubcommand(sc => sc
        .setName('name')
        .setDescription('Getting all role name'))
      .addSubcommand(sc => sc
        .setName('icon')
        .setDescription("Getting all icons of all roles")
        .addStringOption(o => o
          .setName("format")
          .setDescription("In what format do you want the icons?")
          .addChoices(
            { name: 'webp', value: 'webp' },
            { name: 'png', value: 'png' },
            { name: 'jpg', value: 'jpg' },
            { name: 'jpeg', value: 'jpeg' }
          )
          .setRequired(true))
        .addNumberOption(o => o
          .setName('size')
          .setDescription('At what size do you want the icon to be? (pixel)')
          .addChoices(
            { name: '4096', value: 4096 },
            { name: '2048', value: 2048 },
            { name: '1024', value: 1024 },
            { name: '600', value: 600 },
            { name: '512', value: 512 },
            { name: '300', value: 300 },
            { name: '256', value: 256 },
            { name: '128', value: 128 },
            { name: '96', value: 96 },
            { name: '64', value: 64 },
            { name: '56', value: 56 },
            { name: '32', value: 32 },
            { name: '16', value: 16 }
          )
          .setRequired(true))
        .addBooleanOption(o => o
          .setName('name')
          .setDescription('If you also want to get the name of the role (default: true)')))
      .addSubcommand(sc => sc
        .setName('color')
        .setDescription("Getting all Colors of all roles")
        .addBooleanOption(o => o
          .setName("hex")
          .setDescription("Do you want to get a hex value?")
          .setRequired(true))))
    .addSubcommandGroup(scg => scg.setName("guild")
      .setDescription("Get information about the guild")
      .addSubcommand(sc => sc
        .setName("description")
        .setDescription("Get the description of the server"))
      .addSubcommand(sc => sc
        .setName("name")
        .setDescription("Why would you?"))
      .addSubcommand(sc => sc
        .setName("features")
        .setDescription("See the server's features")
        .addStringOption(o => o
          .setName("invite")
          .setDescription("If you have an invite, you can give it, we'll send the features back"))))
    .addSubcommand(sc => sc.setName("emojis")
      .setDescription("Getting all emojis of a server")
      .addBooleanOption(o => o
        .setName('name')
        .setDescription('If you also want to get the name of the emojis (default: true)')))
    .addSubcommand(sc => sc.setName('stickers')
      .setDescription('Getting all stickers of a server')
      .addBooleanOption(o => o
        .setName('name')
        .setDescription('If you also want to get the name of the stickers (default: true)')))
    .toJSON();

  public beta = false;
  public enable = true;

  async execute(interaction: ChatInputCommandInteraction) {
    const client: Client = interaction.client;

    if (!interaction.inGuild()) return interaction.reply("You can't use this command in DMs. (How did you even run it through DMs in the first place?)");
    await interaction.deferReply({ ephemeral: true });

    const guild = await interaction.client.guilds.fetch(interaction.guildId);

    const pasteeKey = client.config?.pastee.key;
    if (!pasteeKey) return interaction.followUp("There is no config available :/\nCan't get the pastee api key.");

    const sc = interaction.options.getSubcommand(true)

    switch (interaction.options.getSubcommandGroup()) {
      case "role": {
        switch (sc) {
          case "name": {
            const guildRoles = await guild.roles.fetch(undefined);
            if (!guildRoles) return interaction.followUp("Couldn't obtain roles")
            const ArrName: string[] = [];
            guildRoles.forEach(e => {
              if (e.name !== "@everyone") ArrName.push(e.name);
            });

            if (ArrName.length) {
              await this.sendAsPaste(ArrName.join("\n"), interaction, pasteeKey)
            }
            else if (!ArrName.length) interaction.followUp("Why does not even a single role exist?");
            break
          }
          case "icon": {
            const guildRoles = await guild.roles.fetch();
            const extension = interaction.options.getString("format", true);
            const size = interaction.options.getNumber("size", true);
            let name = interaction.options.getBoolean('name');
            if (name === null) name = true;
            const ArrayURL: string[] = [];
            
            if (!this.checkSize(size) || !this.checkFormat(extension)) {
              return interaction.followUp({content: "Somehow, size & format aren't correct...", ephemeral: true});
            }

            for (const [, e] of guildRoles) {
              if (!e.iconURL()) continue

              if (name) ArrayURL.push(`${e.iconURL({ extension, size })} for ${e.name}`);
              else if (!name) ArrayURL.push(`${e.iconURL({ extension, size })}`);
            }

            if (ArrayURL.length) {
              if (name) this.sendAsPaste(ArrayURL.join("\n"), interaction, pasteeKey)
              else if (!name) this.sendAsPaste(ArrayURL.join(""), interaction, pasteeKey)
            }
            else if (!ArrayURL.length) interaction.followUp("No role found with an icon");
            break
          }
          case 'color': {
            const guildRoles = await guild.roles.fetch();
            const hex = interaction.options.getBoolean("hex");
            const ArrColor: string[] = [];

            guildRoles.forEach(e => {
              let color
              if (hex) color = e.hexColor; else color = e.color;

              if (hex && color !== '#000000' || !hex && color !== 0) ArrColor.push(`${color} for ${e.name}`);
            });

            if (ArrColor.length) this.sendAsPaste(ArrColor.join("\n"), interaction, pasteeKey);
            else if (!ArrColor.length) interaction.followUp("No role found to have color");
            break
          }
        }
        break
      }
      case "guild": {
        switch (sc) {
          case "description": {
            if (guild.description) return interaction.followUp(`The description of this server is \`${guild.description}\``)
            
            return interaction.followUp("This server doesn't have a description.");
          }
          case "name": {
            return interaction.followUp(`The name of this server is \`${guild.name}\``)
          }
          case "features": {
            const invite = interaction.options.getString("invite");
            if (!invite) return interaction.followUp({ content: `${guild.name} has ${guild.features.length} features: \n\`\`\`${guild.features.join("\n")}\`\`\`` })

            const inviteData = await interaction.client.fetchInvite(invite);

            if (!inviteData.guild) return interaction.followUp("How do i not have access to the guild");
            interaction.followUp({ content: `${inviteData.guild.name} has ${inviteData.guild.features.length} features: \n\`\`\`${inviteData.guild.features.join("\n")}\`\`\`` })
          }
        }
        break
      }
      default: {
        switch (sc) {
          case "emojis": {
            await guild.fetch();
            const emojis = await guild.emojis.fetch();
            const name = interaction.options.getBoolean('name') ?? true;
            const emojiArr: string[] = [];

            emojis.forEach(e => {
              if (name) emojiArr.push(`${e.url} for ${e.name}`);
              else if (!name) emojiArr.push(`${e.url}`);
            });

            if (emojiArr.length) {
              if (name) await this.sendAsPaste(emojiArr.join("\n"), interaction, pasteeKey);
              else if (!name) await this.sendAsPaste(emojiArr.join(' '), interaction, pasteeKey);
            }
            else if (!emojiArr.length) interaction.followUp({ content: "No emoji found" })
            break
          }
          case "stickers": {
            const stickers = await guild.stickers.fetch();
            const name = interaction.options.getBoolean('name') ?? true;
            const stickersArr: string[] = [];

            stickers.forEach(e => {
              if (name) stickersArr.push(`${e.url} for ${e.name}`);
              else if (!name) stickersArr.push(`${e.url}`);
            });


            if (stickersArr.length) {
              if (name) this.sendAsPaste(stickersArr.join("\n"), interaction, pasteeKey);
              else if (!name) this.sendAsPaste(stickersArr.join(' '), interaction, pasteeKey)
            }
            else if (!stickersArr.length) interaction.followUp("No stickers found");
            break
          }
        }
        break
      }
    }
  }

  async sendAsPaste(data: string, interaction: ChatInputCommandInteraction, key: string) {
    axios.post("https://api.paste.ee/v1/pastes", {
      key: key,
      sections: [
        { name: "Processes Data", contents: data }
      ]
    })
      .then(r => {
        if (r.data.success) interaction.followUp({ content: r.data.link })
        else if (!r.data.success) {
          console.error(r.data);
          interaction.followUp("An error ocurred, Pls, check console")
        }
      })
      .catch(e => {
        if (e.response) {
          interaction.followUp({ content: `ERROR: \`${e.response.status}, ${e.response.data.errors[0].message}\`` })
        }
      });
  }

  checkSize(size: number): size is 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 {
    switch (size) {
      case 16:   case 32:   case 64:
      case 128:  case 256:  case 512:
      case 1024: case 2048: case 4096:
        return true;
      default: return false;
    }
  }

  checkFormat(format: string): format is "webp" | "png" | "jpg" | "jpeg" | "gif" {
    switch (format.toLowerCase()) {
      case "webp": case "png":
      case "jpg": case "jpeg":
      case "gif":
        return true;
      default: return false;
    }
  }
}

export default new Get();
