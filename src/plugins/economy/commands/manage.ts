import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import { Hermes } from "../../../bot";
import { Economy } from "../economy";

export default {
  commandName: "manage",
  aliases: ["change", "m"],
  permissions: new Permissions(["ADMINISTRATOR"]),
  slash: {
    name: "manage",
    description: "[ADMIN] Change the balance of a member",
    options: [
      {
        name: "target",
        required: true,
        description: "Select a user",
        type: "USER",
      },
      {
        name: "amount",
        required: true,
        description: "Amount to add/subtract",
        type: "NUMBER",
      },
    ],
  },
  commandFn: async (
    Hermes: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    const member = interaction.options.getUser("target");

    if (!interaction.guild) return;

    if (!member) {
      interaction.reply(
        "Invalid users mentioned, make sure you use an id, mention or nickname"
      );
      return;
    }

    const toChange = interaction.options.getNumber("amount");

    if (!toChange) {
      interaction.reply(
        "No number provided, make sure you do a number like +100 or -30"
      );
      return;
    }

    if (toChange > 1001 || toChange < -1001) {
      interaction.reply("Your number must be between -1000 and 1000");
      return;
    }

    const eco: Economy = Hermes.plugins.get("economy").plugin;
    const bal: number = await eco.getUser(member, interaction.guild);

    const newVal = await eco.addUser(member, interaction.guild, toChange);

    interaction.reply(
      (interaction.member as GuildMember).displayName +
        " now has the balance of **" +
        newVal +
        "** after having **" +
        bal +
        "**"
    );
  },
};
