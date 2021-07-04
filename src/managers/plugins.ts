import fs from "fs";
import path from "path";

import { Hermes } from "../bot";
import { Event } from "./events";
import { Command } from "./commands";

type PluginProps = {
  pluginName: string;
  boot: any;
  config: (bot: Hermes) => boolean;
};

class Plugin {
  name: string;
  events: Event[];
  commands: Command[];
  plugin: any;
  constructor(
    Hermes: Hermes,
    props: PluginProps,
    events: Event[],
    commands: Command[]
  ) {
    this.name = props.pluginName;
    this.events = events;
    this.commands = commands;
    this.plugin = new props.boot(Hermes);
  }
}

export default class PluginManager extends Map {
  constructor() {
    super();
  }

  init(Hermes: Hermes): PluginManager {
    const folders = fs.readdirSync(path.resolve(__dirname, "..", "plugins"));

    for (const folder of folders) {
      const location = path.resolve(
        __dirname,
        "..",
        "plugins",
        folder,
        folder + "." + (process.env.NODE_ENV != "production" ? "ts" : "js")
      );
      const props: PluginProps = require(location).default;
      if (props.config(Hermes)) {
        this.addPlugin(Hermes, folder, props, path.dirname(location));
      }
    }

    return this;
  }

  addPlugin(
    Hermes: Hermes,
    plugin: string,
    props: PluginProps,
    dir: string
  ): Plugin {
    const commands = [];
    const events = [];
    try {
      const eventFiles = fs.readdirSync(path.resolve(dir, "events"));
      for (const event of eventFiles) {
        const location = path.resolve(dir, "events", event);
        const props = require(location).default;
        events.push(Hermes.events.addEvent(Hermes, event, props));
      }
    } catch (err) {
      Hermes.logger.err(
        "Unable to find events in " + plugin + ", err: " + err.message
      );
    }
    try {
      const commandFiles = fs.readdirSync(path.resolve(dir, "commands"));
      for (const command of commandFiles) {
        const location = path.resolve(dir, "commands", command);
        const props = require(location).default;
        commands.push(Hermes.commands.addCommand(props, location));
      }
    } catch (err) {
      Hermes.logger.err(
        "Unable to find commands in " + plugin + ", err: " + err.message
      );
    }
    const finalPlugin = new Plugin(Hermes, props, events, commands);
    this.set(props.pluginName, finalPlugin);
    return finalPlugin;
  }
}
