import { Hermes } from "../../bot";

class Messages {}

export default {
  boot: Messages,
  pluginName: "messages",
  config: (bot: Hermes): boolean => bot.config.plugins.messages.enabled,
};
