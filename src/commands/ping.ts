import { Message } from "discord.js";

import { Hermes } from "../bot";

export default {
  commandName: "ping",
  commandFn: (bot: Hermes, message: Message): void => {
    const start = message.createdTimestamp;
    const now = new Date().getTime();
    const speed = now - start;
    message.channel.send(
      "PONG! " +
        speed +
        "ms and discord connection speed of " +
        bot.ws.ping +
        "ms"
    );
  },
};
