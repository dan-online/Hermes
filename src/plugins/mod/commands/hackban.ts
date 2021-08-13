import { CommandInteraction, Guild } from "discord.js";
import { Mod } from "../mod";
import { Hermes } from "../../../bot";

export default {
  commandName: "hackban",
  aliases: [],
  slash: {
    name: "hackban",
    description: "Ban a user not currently a member",
    options: [
      {
        name: "id",
        type: "STRING",
        description: "ID of user to hackban",
        required: true,
      },
      {
        name: "reason",
        type: "STRING",
        description: "Reason for hackban",
      },
    ],
  },
  commandFn: (Hermes: Hermes, interaction: CommandInteraction): void => {
    const plugin = Hermes.plugins.get("mod").plugin as Mod;
    const member = interaction.options.getString("id");

    if (!member) {
      interaction.reply("Invalid users mentioned, make sure you use an id");
      return;
    }
    const reason = interaction.options.getString("reason") || "N/A";
    Hermes.users
      .fetch(member)
      .then(async (user) => {
        const hackbanCase = await plugin.addCase(
          interaction.guild as Guild,
          user,
          reason,
          interaction.user,
          "hackban"
        );
        interaction.reply(
          "Hackbanned " +
            user.username +
            "#" +
            user.discriminator +
            ", case: " +
            hackbanCase.id
        );
      })
      .catch((err) => {
        interaction.reply("Unable to find this discord user: " + err.message);
      });

    // message.channel.send(member.id);
  },
};
