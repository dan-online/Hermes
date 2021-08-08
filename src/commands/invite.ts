import { CommandInteraction } from "discord.js";
import { Hermes } from "../bot";

export default {
  commandName: "invite",
  aliases: ["inv"],
  slash: {
    name: "invite",
    description: "Get the invite link for the bot.",
  },
  commandFn: (Hermes: Hermes, interaction: CommandInteraction) => {
    interaction.reply(
      "https://discord.com/oauth2/authorize?client_id=" +
        Hermes.user?.id +
        "&scope=bot+applications.commands&permissions=8"
    );
  },
};
