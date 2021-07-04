import Discord, { Message } from "discord.js";
import { Hermes } from "../../../bot";
import { Mod } from "../mod";

export default {
  commandName: "case",
  aliases: ["cases"],
  commandFn: async (
    Hermes: Hermes,
    message: Message,
    args: string[]
  ): Promise<void> => {
    if (!message.guild) return;
    const id = args.join(" ");
    const mod = Hermes.plugins.get("mod").plugin as Mod;
    const config = Hermes.config;
    const { cases } = await mod.getGuild(message.guild);
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
      message.channel.send({ embeds: [Embed] });
    } else {
      const Embed = new Discord.MessageEmbed()
        .setTitle("Mod Cases")
        .setColor(config.color)
        .setDescription(cases.map((x) => x.id).join("\n"));
      message.channel.send({ embeds: [Embed] });
    }
  },
};
