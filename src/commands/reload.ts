import { CommandInteraction, Message, Permissions } from "discord.js";
import config from "../../config";

import { Hermes } from "../bot";

export default {
  commandName: "reload",
  permissions: new Permissions([0n]),
  slash: {
    name: "reload",
    description: "Reloads a command",
    permissions: [
      {
        id: config.owners[0],
        type: "USER",
        permission: true,
      },
    ],
    options: [
      {
        name: "command",
        description: "Command to reload",
        type: "STRING",
      },
    ],
  },
  commandFn: async (
    client: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    const command = interaction.options.getString("command");
    const commandProps = client.commands.get(command);
    delete require.cache[commandProps.location];
    client.commands.delete(command);
    const newCommand = require(commandProps.location).default;
    client.commands.addCommand(newCommand, commandProps.location);
    interaction.reply("Reloaded " + command);
  },
};
