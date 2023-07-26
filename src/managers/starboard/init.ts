import { MessageReaction, User } from "discord.js";
import { ExtendedClient } from "../../Client";
import { BaseManager } from "../base";

export default new class StarBoardManager extends BaseManager {
  public name = "starboard";

  public init(client: ExtendedClient) {
    if (client.managers) client.managers.starboard = this;
  }

  public async checkReactions(reaction: MessageReaction, user: User) {
    reaction = await reaction.fetch()

    reaction.emoji.name
  }
}