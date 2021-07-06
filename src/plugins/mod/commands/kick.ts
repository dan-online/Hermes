import { GuildMember, Message } from "discord.js";
import { Hermes } from "../../../bot";
import getmember from "../../../utils/getmember";
import createInteraction from "../../../utils/interaction";

export default {
  commandName: "kick",
  aliases: [],
  commandFn: (Hermes: Hermes, message: Message, args: string[]): void => {
    const { member, reason } = getmember(message, args);

    if (!member) {
      message.channel.send(
        "Invalid users mentioned, make sure you use an id, mention or nickname"
      );
      return;
    }
    function next(
      update: (text: string) => void,
      member: GuildMember,
      m?: Message
    ) {
      member
        .kick(reason)
        .then(() => {
          update("Successfully kicked " + member.displayName);
        })
        .catch((err) => {
          update(
            "Unable to kick " + member.displayName + " due to " + err.message
          );
          if (m) m.delete();
        });
    }
    createInteraction(
      "You are about to kick ``" +
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
        return update("Kick successfully cancelled");
      }
      member
        .send(
          "You have been kicked from " +
            message.guild?.name +
            " for ``" +
            reason +
            "``"
        )
        .then((m) => {
          next(update, member, m);
        })
        .catch((err) => {
          message.channel.send(
            "Unable to send kick message due to: " +
              err.message +
              ", proceeding to kick"
          );
          next(update, member);
        });
    });
  },
};
