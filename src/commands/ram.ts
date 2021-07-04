import { Message } from "discord.js";
import { Hermes } from "../bot";

export default {
  commandName: "ram",
  aliases: ["memory"],
  commandFn(_bot: Hermes, message: Message): void {
    message.channel.send(
      Math.round((process.memoryUsage().heapUsed / (1024 * 1024)) * 100) / 100 +
        "MB of ram usage"
    );
    return;
  },
};
