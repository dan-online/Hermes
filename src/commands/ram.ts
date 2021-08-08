import { CommandInteraction } from "discord.js";
import { Hermes } from "../bot";

export default {
  commandName: "ram",
  aliases: ["memory"],
  slash: {
    name: "ram",
    description: "Shows the amount of RAM the bot is using.",
  },
  commandFn(_bot: Hermes, interaction: CommandInteraction): void {
    interaction.reply(
      Math.round((process.memoryUsage().heapUsed / (1024 * 1024)) * 100) / 100 +
        "MB of ram usage"
    );
    return;
  },
};
