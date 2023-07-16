import { APIEmbed, EmbedBuilder } from "discord.js";

export function errorToEmbed(error: unknown, description: string): APIEmbed {
  const embed = new EmbedBuilder({
    author: {
      name: "Error",
      iconURL: "https://raw.githubusercontent.com/abrahammurciano/discord-lumberjack/main/images/error.png"
    },
    description
  });

  if (error instanceof Error) {
    embed.addFields([
      {
        name: "Error",
        value: `${error}\n\n${error.message}`,
        inline: true
      }, {
        name: "From",
        value: `${error.stack}`,
        inline: true
      }])
  }

  return embed.toJSON();
}