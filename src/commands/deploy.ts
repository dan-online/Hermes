import {
  ApplicationCommandPermissionData,
  CommandInteraction,
  MessageApplicationCommandData,
  Permissions,
} from "discord.js";
import config from "../../config";
import util from "util";
import { Hermes } from "../bot";

interface extraApp extends MessageApplicationCommandData {
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
    console.log(util.inspect(data, { depth: 3 }));
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
