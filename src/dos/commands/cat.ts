import type { Client } from "../../Client";
import type { Config } from "../config";
import { readFile } from "node:fs/promises";

export const name = ["type", "cat"]

export async function execute(client: Client, config: Config, args: string[]) {
  const file = args.join(" ");
  if (!file) {
    console.log('Required parameter missing');
    return
  }
  config.cmd.setPrompt(" ");
  switch (config.drives.current) {
    case 'S': {
      console.log('General failure reading drive S:')
      console.log('Abort, Retry, Fail?a\n')
      break
    }
    case 'C': {
      const data = await readFile(`${config.drives.C.current}/${file.toLowerCase()}`, 'utf8').catch(err => {
        if (err) { console.log(`File not found - ${file.toLowerCase()}`); return }
      });
      console.log(data + "\n")
    }
  }
}