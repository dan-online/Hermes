import { CommandInteraction, Message, Permissions } from "discord.js";
import util from "util";
import config from "../../config";

import { Hermes } from "../bot";

export default {
  commandName: "eval",
  permissions: new Permissions([0n]),
  slash: {
    name: "eval",
    description: "Evaluate code in a js dev environment",
    permissions: [
      {
        id: config.owners[0],
        type: "USER",
        permission: true,
      },
    ],
    options: [
      {
        name: "code",
        description: "Enter your code",
        type: "STRING",
      },
      {
        name: "await",
        description: "Whether the code is asynchronous",
        type: "BOOLEAN",
      },
    ],
  },
  commandFn: async (
    client: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    const toAwait = interaction.options.getBoolean("await");
    const code = interaction.options.getString("code") || "";
    try {
      let val;
      if (toAwait) {
        val = await eval("(async () => " + code + ")()");
      } else {
        val = eval(code);
      }
      interaction.reply("```js\n" + util.inspect(val) + "```");
    } catch (err) {
      interaction.reply("```js\nError: " + (err as Error).message + "```");
    }
  },
};
