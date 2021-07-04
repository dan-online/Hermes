import { Message } from "discord.js";
import { Hermes } from "../../../bot";
import getmember from "../../../utils/getmember";

export default {
  commandName: "ban",
  aliases: [],
  commandFn: (Hermes: Hermes, message: Message, args: string[]): void => {
    const member = getmember(message, args);

    if (!member) {
      message.channel.send(
        "Invalid users mentioned, make sure you use an id, mention or nickname"
      );
      return;
    }

    const reason = args.join(" ") || "N/A";
    member
      .send(
        "You have been banned from " +
          message.guild?.name +
          " for ``" +
          reason +
          "``"
      )
      .then((m) => {
        member
          .ban({ reason: reason })
          .then(() => {
            message.channel.send("Successfully baned " + member.displayName);
          })
          .catch((err) => {
            message.channel.send(
              "Unable to ban " + member.displayName + " due to " + err.message
            );
            m.delete();
          });
      });

    message.channel.send(member.id);
  },
};
