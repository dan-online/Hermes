import { Message } from "discord.js";
import { Hermes } from "../../../bot";
import getmember from "../../../utils/getmember";
import createInteraction from "../../../utils/interaction";

export default {
  commandName: "ban",
  aliases: [],
  commandFn: (Hermes: Hermes, message: Message, args: string[]): void => {
    const { member, reason } = getmember(message, args);

    if (!member) {
      message.channel.send(
        "Invalid users mentioned, make sure you use an id, mention or nickname"
      );
      return;
    }

    createInteraction(
      "You are about to ban ``" +
        member.user.username +
        "`` for ``" +
        reason +
        "``" +
        "\n**Are you sure?**",
      message,
      [
        {
          label: "Cancel",
          style: "PRIMARY",
          customID: "cancel",
        },
        {
          label: "Confirm",
          style: "DANGER",
          customID: "confirm",
        },
      ]
    ).then(({ interaction, update }) => {
      if (interaction.customID != "confirm") {
        return update("Ban successfully cancelled");
      }
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
              update("Successfully banned " + member.displayName);
            })
            .catch((err) => {
              update(
                "Unable to ban " + member.displayName + " due to " + err.message
              );
              m.delete();
            });
        });
    });
  },
};
