import { Client } from "../Client";

export abstract class Events {
  public abstract name: string;
  public abstract once: boolean;
  public abstract execute: (this: Events, client: Client, ...args: any[]) => any;

}