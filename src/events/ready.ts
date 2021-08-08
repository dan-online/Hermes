import { ApplicationCommandData } from "discord.js";
import { Hermes } from "../bot";
export default {
  eventName: "ready",
  eventFn: (Hermes: Hermes): void => {
    Hermes.logger.info(Hermes.user?.username + " online!");
    const data: ApplicationCommandData[] = [];

    for (const command of Hermes.commands.values()) {
      if (command.slash) {
        data.push(command.slash);
      }
    }
    // const commands = Hermes.application?.commands.set(data);
    // commands
    //   ?.then(() => {
    //     Hermes.logger.info("Commands registered!");
    //   })
    //   .catch(console.error);
  },
};
