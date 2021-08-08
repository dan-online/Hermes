import { Interaction } from "discord.js";
import { Hermes } from "../bot";
export default {
  eventName: "interactionCreate",
  eventFn: (Hermes: Hermes, interaction: Interaction): void => {
    if (!interaction.isCommand() || !interaction.inGuild()) return;
    if (interaction.user.bot) return;

    const commandFn = Hermes.commands.getCommand(interaction.commandName);

    if (!commandFn) {
      return;
    }

    if (
      commandFn.permissions.bitfield == 0n &&
      Hermes.config.owners.indexOf(interaction.member?.user.id || "") < 0
    ) {
      interaction.reply("This is an owner only command!");
      return;
    }

    let userAllowed =
      typeof interaction.member?.permissions != "string"
        ? interaction.member?.permissions.any(commandFn.permissions)
        : false;

    if (!interaction.member?.permissions) {
      userAllowed = true;
    }

    if (!userAllowed) {
      interaction.reply(
        "You do not have the correct permissions for this command: " +
          commandFn.permissions.toArray().join(", ")
      );
      return;
    }
    commandFn.fn(Hermes, interaction, []);
  },
};
