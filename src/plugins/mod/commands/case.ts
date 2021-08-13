import Discord, { CommandInteraction } from "discord.js";
import { Hermes } from "../../../bot";
import { Mod } from "../mod";

export default {
  commandName: "case",
  aliases: ["cases"],
  slash: {
    name: "cases",
    description: "View cases of previous bans/kicks",
    options: [
      {
        name: "case",
        description: "Case ID to view",
        type: "STRING",
      },
    ],
  },
  commandFn: async (
    Hermes: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    if (!interaction.guild) return;
    const id = interaction.options.getString("case");
    const mod = Hermes.plugins.get("mod").plugin as Mod;
    const config = Hermes.config;
    const { cases } = await mod.getGuild(interaction.guild);
    const foundCase = cases.find((x) => x.id == id);
    if (id && id.length > 1 && foundCase) {
      const Embed = new Discord.MessageEmbed()
        .setTitle(
          foundCase.action[0].toUpperCase() +
            foundCase.action.slice(1) +
            " case " +
            id
        )
        .setDescription(
          "ID: " +
            foundCase.user.id +
            "\nUsername: " +
            foundCase.user.username +
            "\nReason: " +
            foundCase.reason
        )
        .setColor(config.color)
        .setFooter(
          "By " + foundCase.actor.username + "#" + foundCase.actor.discriminator
        )
        .setTimestamp(foundCase.date);
      interaction.reply({ embeds: [Embed] });
    } else {
      const Embed = new Discord.MessageEmbed()
        .setTitle("Mod Cases")
        .setColor(config.color)
        .setDescription(
          cases.length > 0
            ? cases.map((x) => x.id).join("\n")
            : "No cases found! Spooky :ghost:"
        );
      interaction.reply({ embeds: [Embed] });
    }
  },
};
