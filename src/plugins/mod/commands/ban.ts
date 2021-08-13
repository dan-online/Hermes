import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import { Hermes } from "../../../bot";
import createInteraction from "../../../utils/interaction";

export default {
  commandName: "ban",
  permissions: new Permissions(["BAN_MEMBERS"]),
  aliases: [],
  slash: {
    name: "ban",
    description: "[BAN] Ban a user from your guild",
    options: [
      {
        name: "member",
        description: "Member to ban",
        type: "USER",
        required: true,
      },
      {
        name: "reason",
        description: "Reason for ban",
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
      "You are about to ban ``" +
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
    ).then(({ interaction, update }) => {
      if (interaction?.customId != "confirm") {
        return update("Ban successfully cancelled");
      }
      member
        .send(
          "You have been banned from " +
            interaction.guild?.name +
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
