import { BaseInteraction } from "./BaseInteraction.js";

export abstract class ModelInteraction extends BaseInteraction<false> {
  public abstract name: string;
  public abstract isStartOfName: boolean;
  public data = null;
}