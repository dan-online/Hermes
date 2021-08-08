import {
  ApplicationCommandData,
  CommandInteraction,
  Permissions,
} from "discord.js";
import config from "../../config";

import { Hermes } from "../bot";

export default {
  commandName: "deploy",
  permissions: new Permissions([0n]),
  slash: {
    name: "deploy",
    description: "Deploy the commands",
    defaultPermission: false,
    permissions: config.owners.map((id) => ({
      id,
      type: "USER",
      permission: true,
    })),
  },
  commandFn: async (
    Hermes: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    const data: ApplicationCommandData[] = [];

    for (const command of Hermes.commands.values()) {
      if (command.slash) {
        data.push(command.slash);
      }
    }
    const commands = interaction.guild?.commands.set(data);
    commands
      ?.then(() => {
        interaction.reply("Commands registered!");
      })
      .catch(console.error);
  },
};
