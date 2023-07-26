import { MessageReaction, User, Events as Event } from "discord.js";
import { Events } from "../../base";
import { ExtendedClient } from "../../../Client";

export default new class MessageReactionAdd extends Events {
  public name = Event.MessageReactionAdd;
  public once = false;

  public execute(reaction: MessageReaction, user: User) {
    const client: ExtendedClient<true> = reaction.client;

    if (client.managers?.starboard && client.config?.starboard.enable) client.managers.starboard.checkReactions(reaction, user);
  }
}