import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, MessageReaction, MessageType, PartialMessage, SendableChannels, PartialMessageReaction, Client } from "discord.js";
import { BaseManager } from "../base.js";
import { ThingBoardEmoji } from "../../baseConfig";
import { Model, ModelStatic } from "sequelize";

export class ThingBoardManager extends BaseManager {
  public name = "thingboard";

  #channel: Record<string, SendableChannels> = {};
  public async init(this: ThingBoardManager, client: Client) {
    for (const e of client.config?.thingboard.emoji ?? []) {
      const channel = await (await client.guilds.fetch(e.serverId)).channels.fetch(e.channelId);
      if (channel?.isTextBased()) this.#channel[e.emoji] = channel;
    }
  }

  public async check(reaction: MessageReaction | PartialMessageReaction) {
    const rec = !reaction.partial ? reaction : await reaction.fetch();
    const client = rec.client;
    
    const message = rec.message;
    if (!this.#underNumDays(message.createdTimestamp)) return;

    for (const e of Object.values(this.#channel)) if (e.id === message.channelId) return;

    const config: Config | undefined = client.config?.thingboard;
    const [emoji, count] = await this.#ReactionCountChecker(rec, config);
    if (!emoji && !count) return;

    const DBMessageBotId = await this.#checkSent(client.db?.star, message.id, emoji);
    const messageBotId = await this.#send(message, emoji, count, DBMessageBotId);
    if (!DBMessageBotId) this.#saveInDB(rec, emoji, messageBotId ?? "");
  }

  async #send(message: Message | PartialMessage, emoji: string, count: number, messageBotId: false | string): Promise<string | void> {
    let msg = !message.partial ? message : undefined;
    if (!msg) msg = await message.fetch(true)

    const embed = await this.#createEmbed(msg);
    const buttons = await this.#createButton(msg);

    if (!messageBotId) return (await this.#channel[emoji].send({ content: `${emoji} **${count}** | <#${message.channel.id}>`, embeds: embed, components: buttons })).id;

    this.#channel[emoji].messages.edit(messageBotId, { content: `${emoji} **${count}** | <#${message.channel.id}>`, embeds: embed, components: buttons })
  }

  async #ReactionCountChecker(reaction: MessageReaction, config: Config | undefined): Promise<[false, false] | [string, number]> {
    if (!config?.enable) return [false, false];
    const msg = !reaction.message.partial ? reaction.message : await reaction.message.fetch();

    const emojiConfig = config.emoji.find(value => value.emoji == reaction?.emoji.name);
    if (!emojiConfig) return [false, false];

    let count = reaction.count || 0;
    for (const [, user] of await reaction.users.fetch()) {
      // if the user is a bot, remove it from the count
      if (user.bot) { count--; continue }
      // if the user is the same that sent the message, remove it from the count
      if (user.id === msg.author.id) {
        count--;
        continue;
      }
    }

    if (count < emojiConfig.number) return [false, false];

    return [emojiConfig.emoji, count];
  }

  #underNumDays(timestamp: number): boolean {
    const mesDate = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - mesDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 20) return false;

    return true;
  }

  async #createEmbed(message: Message): Promise<EmbedBuilder[]> {
    const author = message.author;
    const avatar = author.avatarURL({ extension: "png", size: 512 }) ?? undefined;

    const embed = new EmbedBuilder()
      .setAuthor({ name: author.discriminator !== "#0" ? author.username : `${author.username}#${author.discriminator}`, iconURL: avatar })
      .setColor(Math.floor(Math.random() * 16777215))
      .setTimestamp(new Date());

    if (message.content) embed.setDescription(message.content.length > 1024 ? message.content.slice(0, 1020) + "..." : message.content)
    else if (message.embeds[0]) {
      for (const e of message.embeds) {
        if (e.description) {
          embed.setDescription(e.description);
          break;
        }
      }
    }

    if (message.attachments.size) embed.setImage(message.attachments.first()?.url ?? null)

    if (message.type === MessageType.Reply) {
      const ref = await message.fetchReference()
      if (ref.content) embed.setFields({ name: "Replied to:", value: ref.content })
      else if (ref.embeds[0]) {
        let yesnt = true
        ref.embeds.forEach(e => { if (e.description && yesnt) { embed.setFields({ name: "Replied to:", value: e.description }); yesnt = false } })
      }
    }

    return [embed]
  }

  async #createButton(message: Message): Promise<ActionRowBuilder<ButtonBuilder>[]> {
    const buttons = [new ActionRowBuilder<ButtonBuilder>()
      .addComponents(new ButtonBuilder()
        .setLabel("Original Message")
        .setStyle(ButtonStyle.Link)
        .setURL(message.url)
      )]

    if (message.type === MessageType.Reply) {
      const ref = await message.fetchReference();
      buttons.push(new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()
        .setLabel("Reply Message")
        .setStyle(ButtonStyle.Link)
        .setURL(ref.url)
      ));
    }
    return buttons
  }

  async #saveInDB(reaction: MessageReaction, emoji: string, messageIdBot: string) {
    const client = reaction.client;
    
    const db = client.db?.star;
    if (!db) return console.error("Database not found. (thingboard)");

    await db.findOrCreate({
      where: {
        messageId: reaction.message.id,
        messageIdBot,
        emoji,
      }
    });
  }

  async #checkSent(db: ModelStatic<Model<any, any>> | undefined, messageId: string, emoji: string): Promise<false | string> {
    if (!db) return false;
    const DBresult = await db.findOne({ where: { messageId, emoji } });

    if (!(DBresult)) return false

    return DBresult.dataValues.messageIdBot;
  }
}

export default new ThingBoardManager();

interface Config {
  enable: boolean,
  emoji: ThingBoardEmoji[]
}