import { GuildMember } from "discord.js";
import { Events } from "../../base.js";

export default new class MessageReactionAdd extends Events {
  public name = "guildMemberAdd" as const;
  public once = false;

  public async execute(member: GuildMember) {
    const client = member.client;
    const db = client.db?.jailed;

    if ((await db?.findOne({ where: { userID: member.user.id } })) && client.config?.jail.givenRole) {
      member.roles.add(client.config.jail.givenRole);
    }
  }
}