import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  Permissions,
} from "discord.js";
import config from "../../config";

import { Hermes } from "../bot";

interface extraApp extends ApplicationCommandData {
  permissions: ApplicationCommandPermissionData[];
}

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
    const data: extraApp[] = [];

    for (const command of Hermes.commands.values()) {
      if (command.slash) {
        data.push(command.slash);
      }
    }
    const commands = interaction.guild?.commands.set(data);
    commands
      ?.then(async (finalCommands) => {
        for (const command of data) {
          if (command.permissions) {
            await finalCommands
              .find((x) => x.name == command.name)
              ?.permissions.set({ permissions: command.permissions });
          }
        }
        interaction.reply("Commands deployed!");
      })
      .catch(console.error);
  },
};
