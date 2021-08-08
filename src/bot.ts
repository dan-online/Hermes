import { Client } from "discord.js";

import CommandManager from "./managers/commands";
import logger from "./utils/log";

import config from "../config";
import EventManager from "./managers/events";
import PluginManager from "./managers/plugins";
import { FileCacheManager } from "./managers/filecache";

export class Hermes extends Client {
  config = config;
  events = new EventManager();
  commands = new CommandManager();
  plugins = new PluginManager();
  fileCache = new FileCacheManager();
  logger = logger;
  constructor() {
    super({
      intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
    });

    this.commands.init();
    this.events.init(this);
    this.plugins.init(this);

    this.login(process.env.TOKEN);
  }
}
