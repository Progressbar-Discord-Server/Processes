import Bsky, { type BskyAgent as BAgent } from "@atproto/api";
// @ts-ignore
const { BskyAgent } = Bsky;
import { Attachment, Collection, Message, PartialMessage } from "discord.js";
import { Social } from "./base.js";
import axios from "axios";
import { ImplementationConfig } from "../../../baseConfig";

export default new class BlueskySocial extends Social {
  public name = "bluesky" as const;
  
  #bAgent: BAgent = new BskyAgent({service: "https://bsky.social"});

  async init(config: ImplementationConfig) {
    this.#bAgent.login({
      identifier: config?.username as string,
      password: config?.appPassword as string
    });
  }

  async send(config: ImplementationConfig, message: Message | PartialMessage) {
    if (!message.content) return;
    this.#bAgent.post({
      text: message.content,
    });
  }
  async send_files(attachments: Collection<string, Attachment>) {
    for (const [,e] of attachments) {
      const { data } = await axios.get(e.proxyURL, {
        responseType: "blob"
      })
      await this.#bAgent.uploadBlob(data)
    }
  }

  async checkExtendedConfig(config: ImplementationConfig) {
    if (!config) return false;
    if (typeof config.username !== "string") return false;
    if (typeof config.appPassword !== "string") return false;

    return true
  }
}
