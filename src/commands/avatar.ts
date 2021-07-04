import { Message } from "discord.js";

import { Hermes } from "../bot";
import getmember from "../utils/getmember";

export default {
  commandName: "avatar",
  commandFn: async (
    Hermes: Hermes,
    message: Message,
    args: string[]
  ): Promise<void> => {
    const member = getmember(message, args);
    const id = args.find((x) => x.length >= 18) as `${bigint}` | undefined;
    if (member) {
      message.channel.send(
        member.user.displayAvatarURL({
          size: 512,
          format: member.user.avatar?.startsWith("a_") ? "gif" : "png",
        })
      );
    } else if (id) {
      const resolved = await Hermes.users.fetch(id);
      message.channel.send(
        resolved.displayAvatarURL({
          size: 512,
          format: resolved.avatar?.startsWith("a_") ? "gif" : "png",
        })
      );
    } else {
      message.channel.send(
        message.author.displayAvatarURL({
          size: 512,
          format: message.author.avatar?.startsWith("a_") ? "gif" : "png",
        })
      );
    }
  },
};
