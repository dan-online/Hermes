import fs from "fs";
import path from "path";
import { Message } from "discord.js";

import { Hermes } from "../bot";

type EventFnType = (
  bot: Hermes,
  message: Message,
  args: string[],
  ...rest: any[]
) => void;

type EventProps = {
  eventFn: EventFnType;
  eventName: string;
};

export class Event {
  fn: EventFnType;
  name: string;
  constructor(props: EventProps) {
    this.fn = props.eventFn;
    this.name = props.eventName;
  }
}

export default class EventManager extends Map {
  constructor() {
    super();
  }

  init(Hermes: Hermes): EventManager {
    const files = fs.readdirSync(path.resolve(__dirname, "..", "events"));
    for (const file of files) {
      const location = path.resolve(__dirname, "..", "events", file);
      const props = require(location).default;
      this.addEvent(Hermes, path.basename(file), props);
    }
    return this;
  }
  addEvent(Hermes: Hermes, name: string, props: EventProps): Event {
    // Hermes.logger.info(props.eventName + " from " + name);
    Hermes.on(props.eventName, this.eventHandler(Hermes, name));
    const event = new Event(props);
    this.set(name, event);
    return event;
  }
  eventHandler(Hermes: Hermes, name: string) {
    return (...args: any[]): void => this.get(name).fn(Hermes, ...args);
  }
}
