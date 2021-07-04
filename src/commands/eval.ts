import { Message, Permissions } from "discord.js";
import util from "util";

import { Hermes } from "../bot";

export default {
  commandName: "eval",
  permissions: new Permissions([0n]),
  commandFn: async (
    client: Hermes,
    message: Message,
    args: string[]
  ): Promise<void> => {
    const toAwait = args[0] == "await";
    try {
      let val;
      if (toAwait) {
        val = await eval("(async () => " + args.slice(1).join(" ") + ")()");
      } else {
        val = eval(args.join(" "));
      }
      message.channel.send("```js\n" + util.inspect(val) + "```");
    } catch (err) {
      message.channel.send("Error: " + err.message);
    }
  },
};
