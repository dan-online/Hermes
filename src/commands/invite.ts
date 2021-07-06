import { Message } from "discord.js";
import { Hermes } from "../bot";

export default {
  commandName: "invite",
  aliases: ["inv"],
  commandFn: (Hermes: Hermes, message: Message) => {
    message.channel.send(
      "https://discord.com/oauth2/authorize?client_id=" +
        Hermes.user?.id +
        "&scope=bot+applications.commands&permissions=8"
    );
  },
};
