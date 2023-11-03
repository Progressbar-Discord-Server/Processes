import { GuildMember } from "discord.js";
import { Events } from "../../base.js";
import { ExtendedClient } from "../../../Client";

export default new class MessageReactionAdd extends Events {
  public name = "guildMemberAdd" as const;
  public once = false;

  public execute(member: GuildMember) {
    const client: ExtendedClient<true> = member.client;
    const db = client.db?.jailed;
    
    if ((db?.findOne({where: {userID: member.user.id}}) ?? false) && client.config?.jail.givenRole) {
      member.roles.add(client.config.jail.givenRole);
    }
  }
}