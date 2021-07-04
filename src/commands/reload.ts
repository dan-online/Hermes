import { Message, Permissions } from "discord.js";
import util from "util";

import { Hermes } from "../bot";

export default {
  commandName: "reload",
  permissions: new Permissions([0n]),
  commandFn: async (
    client: Hermes,
    message: Message,
    args: string[]
  ): Promise<void> => {
    const command = args[0];
    const commandProps = client.commands.get(command);
    delete require.cache[commandProps.location];
    client.commands.delete(command);
    const newCommand = require(commandProps.location).default;
    client.commands.addCommand(newCommand, commandProps.location);
    message.channel.send("Reloaded " + command);
  },
};
