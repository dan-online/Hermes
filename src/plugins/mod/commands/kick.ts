import { Message } from "discord.js";
import { Hermes } from "../../../bot";
import getmember from "../../../utils/getmember";

export default {
  commandName: "kick",
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
        "You have been kicked from " +
          message.guild?.name +
          " for ``" +
          reason +
          "``"
      )
      .then((m) => {
        member
          .kick(reason)
          .then(() => {
            message.channel.send("Successfully kicked " + member.displayName);
          })
          .catch((err) => {
            message.channel.send(
              "Unable to kick " + member.displayName + " due to " + err.message
            );
            m.delete();
          });
      });

    message.channel.send(member.id);
  },
};
