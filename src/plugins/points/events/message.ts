import { Message } from "discord.js";

import { Hermes } from "../../../bot";

export default {
  eventName: "message",
  eventFn: (Hermes: Hermes, message: Message): void => {
    if (message.author.bot || !message.guild) return;
    Hermes.plugins
      .get("points")
      .plugin.addMessage(message.author, message.channel, message.guild);
  },
};
