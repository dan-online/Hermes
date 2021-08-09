import { CommandInteraction, Message } from "discord.js";

import { Hermes } from "../bot";

export default {
  commandName: "ping",
  commandFn: async (
    bot: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    await interaction.deferReply();
    const reply = (await interaction.editReply("Ping?")) as Message;
    const speed = reply.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(
      "PONG! **" +
        speed +
        "ms** of reply latency and discord latency of **" +
        bot.ws.ping +
        "ms**"
    );
  },
  slash: {
    name: "ping",
    description: "Check the bot's reaction time",
  },
};
