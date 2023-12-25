import { BaseInteraction } from "./BaseInteraction.js";

export abstract class ModelInteraction extends BaseInteraction {
  public abstract name: string;
}