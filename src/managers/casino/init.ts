import { Collection, EmbedBuilder, Snowflake } from "discord.js"
import { BaseManager } from "../base.js";
import { casino } from "../../config.js";
import { ExtendedClient } from "../../Client.js";

export default new class PokerManager extends BaseManager {
  #games = new Collection<Snowflake, Hands>();
  protected cardsToEmbed: Record<string, string> = casino.cardsToEmbed;
  protected deck = ["star", "mario", "luigi", "fire", "mush", "cloud"] as const;
  public name = "poker";

  public init(client: ExtendedClient) {
    if (client.managers) client.managers.poker = this;
  }

  public startNewGame(this: PokerManager, userID: Snowflake) {
    const deck = this.#shuffleDeck();
    const user: string[] = [];
    const luigi: string[] = [];

    for (let i = 0; i < 9; i++) {
      user.push(<string> deck.pop());
      luigi.push(<string> deck.pop());
      i++;
    }

    const data: Hands = {
      deck: deck,
      hands: {
        user,
        luigi,
      }
    }

    this.#games.set(userID, data);
    return user;
  }

  public makeEmbed(hand: string[], luigi?: string[]) {
    const embed = new EmbedBuilder();
    const handEmbed: string[] = [];
    for (const e of hand) {
      handEmbed.push(this.cardsToEmbed[e]);
    }

    let luigiEmbed = [casino.luigiHideCard, casino.luigiHideCard, casino.luigiHideCard, casino.luigiHideCard, casino.luigiHideCard];

    if (luigi) {
      luigiEmbed = [];
      for (const e of luigi) {
        luigiEmbed.push(this.cardsToEmbed[e]);
      }
    }
    return embed;
  }

  #shuffleDeck() {
    const deck = [this.deck, this.deck, this.deck, this.deck, this.deck].flat();

    for (let i = 0; i < deck.length; i++) {
      const m = this.#random(deck.length);
      [deck[m], deck[i]] = [deck[i], deck[m]];
    }

    return deck.reverse();
  }

  #random(max: number, min = 0) {
    return Math.floor(Math.random() * max) + min;
  }

  #countShapes(deck: string[]) {
    const counts: Record<string, number> = {};

    for (const e of this.deck) {
      counts[e] = deck.map(value => { if (value === e) return true; else return false }).length;
    }

    return counts;
  }
}

interface Hands {
  deck: string[],
  hands: {
    user: string[],
    luigi: string[],
  }
}
