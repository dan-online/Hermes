import fs from "fs";
import path from "path";
import { Message, Permissions } from "discord.js";

import { Hermes } from "../bot";

type CommandFnType = (
  bot: Hermes,
  message: Message,
  args: string[],
  ...rest: any[]
) => void;

type CommandProps = {
  commandFn: CommandFnType;
  commandName: string;
  aliases?: string[];
  permissions?: Permissions;
};

export class Command {
  fn: CommandFnType;
  name: string;
  aliases: string[];
  permissions: Permissions;
  location: string;
  constructor(props: CommandProps, location: string) {
    this.location = location;
    this.fn = props.commandFn;
    this.name = props.commandName;
    this.aliases = props.aliases || [];
    this.permissions = props.permissions || new Permissions(["SEND_MESSAGES"]);
  }
}

export default class CommandManager extends Map {
  constructor() {
    super();
  }

  init(): CommandManager {
    const files = fs.readdirSync(path.resolve(__dirname, "..", "commands"));

    for (const file of files) {
      const location = path.resolve(__dirname, "..", "commands", file);
      const props = require(location).default;
      this.addCommand(props, location);
    }

    return this;
  }

  addCommand(props: CommandProps, location: string): Command {
    const command = new Command(props, location);
    this.set(props.commandName, command);
    return command;
  }

  getCommand(command: string): Command | null {
    const straight = this.get(command);
    if (straight) {
      return straight;
    }
    const aliases = Array.from(this.keys()).map((key) => ({
      key,
      aliases: this.get(key).aliases,
    }));
    const found = aliases.find((x) => x.aliases.indexOf(command) >= 0);
    if (found) {
      return this.get(found.key);
    }
    return null;
  }
}
