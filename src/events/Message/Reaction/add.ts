import { MessageReaction, MessageReactionEventDetails, PartialMessageReaction, User } from "discord.js";
import { Events } from "../../base.js";
import { Client } from "discord.js";
import { ThingBoardManager } from "../../../managers/thingboard/init.js";
import { SocialsManager } from "../../../managers/socials/init.js";

export default new class MessageReactionAdd extends Events {
  public name = "messageReactionAdd" as const;
  public once = false;

  public execute(reaction: MessageReaction | PartialMessageReaction, user: User, details: MessageReactionEventDetails) {
    const client: Client<true> = reaction.client;
    
    if (client.managers?.thingboard instanceof ThingBoardManager && client.config?.thingboard?.enable) client.managers.thingboard.check(reaction);
    if (client.managers?.socials instanceof SocialsManager && client.config?.socials?.enable) client.managers.socials.check(reaction, user);
  }
}