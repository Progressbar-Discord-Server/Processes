import { Message, PartialMessage } from "discord.js";
import { ImplementationConfig } from "../../../baseConfig";

export abstract class Social {
  public abstract name: string;
  abstract init(config: ImplementationConfig): Promise<any>;
  abstract send(config: ImplementationConfig, message: Message | PartialMessage): Promise<any>;
  abstract checkExtendedConfig(config: ImplementationConfig): Promise<boolean> | boolean;
}