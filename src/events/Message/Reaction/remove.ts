import { MessageReaction, PartialMessageReaction, User } from "discord.js";
import { Events } from "../../base.js";
import { ExtendedClient } from "../../../Client";
import { ThingBoardManager } from "../../../managers/thingboard/init.js";
import { SocialsManager } from "../../../managers/socials/init.js";

export default new class MessageReactionAdd extends Events {
  public name = "messageReactionRemove" as const;
  public once = false;

  public execute(reaction: MessageReaction | PartialMessageReaction, user: User) {
    const client: ExtendedClient<true> = reaction.client;

    if (client.managers?.thingboard instanceof ThingBoardManager && client.config?.thingboard?.enable) client.managers.thingboard.check(reaction, user);
    if (client.managers?.socials instanceof SocialsManager && client.config?.socials?.enable) client.managers.socials.check(reaction, user);
  }
}