import { CommandInteraction } from "discord.js";

import { Hermes } from "../bot";

export default {
  commandName: "avatar",
  slash: {
    name: "avatar",
    description: "Get the avatar of a user.",
    options: [
      {
        name: "target",
        description: "Select a user",
        type: "USER",
      },
    ],
  },
  commandFn: async (
    Hermes: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    const member = interaction.options.getUser("target") || interaction.user;
    interaction.reply(
      member.displayAvatarURL({
        size: 512,
        dynamic: true,
      })
    );
  },
};
