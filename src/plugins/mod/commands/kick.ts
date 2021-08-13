import {
  CommandInteraction,
  GuildMember,
  Message,
  Permissions,
} from "discord.js";
import { Hermes } from "../../../bot";
import createInteraction from "../../../utils/interaction";

export default {
  commandName: "kick",
  permissions: new Permissions(["KICK_MEMBERS"]),
  aliases: [],
  slash: {
    name: "kick",
    description: "[KICK] Kick a user from your guild",
    options: [
      {
        name: "member",
        description: "Member to kick",
        type: "USER",
        required: true,
      },
      {
        name: "reason",
        description: "Reason for kick",
        type: "STRING",
      },
    ],
  },
  commandFn: async (
    Hermes: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    const reason = interaction.options.getString("reason") || "N/A";
    const member = interaction.options.getMember("member") as GuildMember;

    if (!member) {
      interaction.reply(
        "Invalid users mentioned, make sure you use an id, mention or nickname"
      );
      return;
    }

    await interaction.deferReply();

    createInteraction(
      "You are about to kick ``" +
        member.user.username +
        "`` for ``" +
        reason +
        "``" +
        "\n**Are you sure?**",
      interaction,
      [
        {
          label: "Cancel",
          style: "PRIMARY",
          customId: "cancel",
        },
        {
          label: "Confirm",
          style: "DANGER",
          customId: "confirm",
        },
      ]
    ).then(async ({ interaction, update }) => {
      if (interaction?.customId != "confirm") {
        return update("Kick successfully cancelled");
      }
      let m: Message;
      try {
        m = await member.send(
          "You have been kicked from " +
            interaction.guild?.name +
            " for ``" +
            reason +
            "``"
        );
      } catch {
        // no way to send message
      }

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
    });
  },
};
