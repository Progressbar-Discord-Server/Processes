import { ExtendedClient } from "../Client";

export abstract class BaseManager {
  public abstract name: string;
  public abstract init(this: BaseManager, client: ExtendedClient): any;
}