import { Message, Permissions } from "discord.js";
import { Hermes } from "../../../bot";
import getmember from "../../../utils/getmember";
import { Economy } from "../economy";

export default {
  commandName: "manage",
  aliases: ["change", "m"],
  permissions: new Permissions(["ADMINISTRATOR"]),
  commandFn: async (
    Hermes: Hermes,
    message: Message,
    args: string[]
  ): Promise<void> => {
    if (!message.guild || !message.member) return;

    const member = getmember(message, args);

    if (!member) {
      message.channel.send(
        "Invalid users mentioned, make sure you use an id, mention or nickname"
      );
      return;
    }

    let toChange: number | string | undefined = args.find(
      (x) => !isNaN(Number(x)) && x != member?.id
    );
    if (!toChange) {
      message.channel.send(
        "No number provided, make sure you do a number like +100 or -30"
      );
      return;
    }

    toChange = parseInt(toChange);

    if (toChange > 1001 || toChange < -1001) {
      message.channel.send("Your number must be between -1000 and 1000");
      return;
    }

    const eco: Economy = Hermes.plugins.get("economy").plugin;
    const bal: number = await eco.getUser(member, message.guild);

    const newVal = await eco.addUser(member, message.guild, toChange);

    message.channel.send(
      member.displayName +
        " now has the balance of **" +
        newVal +
        "** after having **" +
        bal +
        "**"
    );
  },
};
