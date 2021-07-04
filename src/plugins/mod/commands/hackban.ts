import { Guild, Message } from "discord.js";
import { Mod } from "../mod";
import { Hermes } from "../../../bot";

export default {
  commandName: "hackban",
  aliases: [],
  commandFn: (Hermes: Hermes, message: Message, args: string[]): void => {
    const plugin = Hermes.plugins.get("mod").plugin as Mod;
    const member = args.find((x) => x.length >= 18) as `${bigint}` | undefined;

    if (!member) {
      message.channel.send("Invalid users mentioned, make sure you use an id");
      return;
    }
    const reason = args.join(" ") || "N/A";
    Hermes.users
      .fetch(member)
      .then(async (user) => {
        const hackbanCase = await plugin.addCase(
          message.guild as Guild,
          user,
          reason,
          message.author,
          "hackban"
        );
        message.channel.send(
          "Hackbanned " +
            user.username +
            "#" +
            user.discriminator +
            ", case: " +
            hackbanCase.id
        );
      })
      .catch((err) => {
        message.channel.send(
          "Unable to find this discord user: " + err.message
        );
      });

    // message.channel.send(member.id);
  },
};
