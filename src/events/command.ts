import { Hermes } from "../bot";

import { Message } from "discord.js";

export default {
  eventName: "message",
  eventFn: (Hermes: Hermes, message: Message): void => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;

    const commands = Hermes.commands;
    const prefix = Hermes.config.prefix;
    const content = message.content;

    const prefixFound = content.split(prefix).length > 1;

    if (!prefixFound) {
      return;
    }

    const command = content.split(prefix)[1].split(" ")[0].toLowerCase();

    if (!command) {
      return;
    }

    const args = content.split(" ").slice(1);
    const commandFn = commands.getCommand(command);

    if (!commandFn) {
      return;
    }

    if (
      commandFn.permissions.bitfield == 0n &&
      Hermes.config.owners.indexOf(message.author.id) < 0
    ) {
      message.channel.send("This is an owner only command!");
      return;
    }

    const userAllowed = message.member?.permissions.any(commandFn.permissions);

    if (!userAllowed) {
      message.channel.send(
        "You do not have the correct permissions for this command: " +
          commandFn.permissions.toArray().join(", ")
      );
      return;
    }

    commandFn.fn(Hermes, message, args);
  },
};
