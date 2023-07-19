export abstract class Events {
  public abstract name: string;
  public abstract once: boolean;
  public abstract execute(this: Events, ...args: any[]): any;
}