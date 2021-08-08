import { CommandInteraction } from "discord.js";

import { Hermes } from "../bot";

export default {
  commandName: "ping",
  commandFn: (bot: Hermes, interaction: CommandInteraction): void => {
    const now = new Date().getTime();
    console.log(interaction);
    const start = interaction.createdTimestamp;
    const speed = now - start;
    interaction.reply(
      "PONG! " +
        speed +
        "ms and discord connection speed of " +
        bot.ws.ping +
        "ms"
    );
  },
  slash: {
    name: "ping",
    description: "Check the bot's reaction time",
  },
};
