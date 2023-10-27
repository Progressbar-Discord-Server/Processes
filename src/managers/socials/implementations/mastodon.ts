import { Attachment, Collection, Message, PartialMessage } from "discord.js";
import { Social } from "./base.js";
import axios, { AxiosInstance } from "axios";
import { ImplementationConfig } from "../../../baseConfig";

export default new class MastodonSocial extends Social {
  public name = "mastodon" as const;

  #axiosAgent: AxiosInstance | null = null;
  async init(config: ImplementationConfig) {
    if (typeof config?.server !== "string" || typeof config?.token !== "string") return;

    const apiEnpoint = config.server.endsWith("/") ? config.server + "api/" : config.server + "/api/";
    const token = config.token;
    this.#axiosAgent = axios.create({
      baseURL: apiEnpoint,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
    });
  }

  async send(config: ImplementationConfig, message: Message | PartialMessage) {
    const msg = !message.partial ? message : await message.fetch();

    if (msg.content.replaceAll("@", "@ ").length > 500) return;

    const mediaIds = await this.#sendMedia(msg.attachments);
    const data: Record<string, any> = {
      status: msg.content.replaceAll("@", "@ ")
    }

    if (mediaIds.length > 0) data.media_ids = mediaIds

    if (this.#axiosAgent) await this.#axiosAgent.post("v1/statuses", data);
  }

  async #sendMedia(attachments: Collection<string, Attachment>): Promise<string[]> {
    const mediaIds = []
    if (!this.#axiosAgent) return [];

    for (const [, media] of attachments) {
      const mediaData = (await axios.get(media.proxyURL, {
        responseType: "stream",
      })).data;

      // await writeFile(pathJoin(tempDir, media.name), mediaData);

      const { data: data } = (await this.#axiosAgent.post("v2/media", {
        file: mediaData,
        description: media.description
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).catch(err => { console.error(err); return { data: { id: undefined } } }));
      mediaIds.push(data.id);
    }

    return mediaIds.filter(e => { if (e != undefined) return true });
  }

  async checkExtendedConfig(config: ImplementationConfig) {
    if (typeof config?.token !== "string") return false;
    if (typeof config?.server !== "string") return false;
    return true
  }
}
