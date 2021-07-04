import Josh from "@joshdb/core";
import { User, TextChannel, Guild } from "discord.js";

import { Hermes } from "../../bot";

const levels = [
  [0, 0],
  [1, 20],
  [2, 50],
  [3, 150],
  [4, 400],
  [5, 700],
  [6, 1200],
  [7, 5000],
  [8, 10000],
  [9, 50000],
  [10, 100000],
];

class Points extends Josh {
  constructor(Hermes: Hermes) {
    super({
      name: "points",
      provider: Hermes.config.josh.provider,
      providerOptions: Hermes.config.josh.options,
    });
  }
  calculatePoints(messages: number): number {
    let levelMin = 0;
    let levelIdx = 0;
    for (const [l, amount] of levels) {
      if (messages >= amount) {
        levelMin = l;
        levelIdx++;
      }
    }

    const nextLevelMessages = levels[levelIdx][1] - levels[levelIdx - 1][1];

    const messagesInLevel = messages - levels[levelIdx - 1][1];
    const level = levelMin + messagesInLevel / nextLevelMessages;
    // const rounded = Math.abs(Math.floor(level));
    // return rounded;
    return level;
  }
  async addMessage(
    user: User,
    channel: TextChannel,
    guild: Guild
  ): Promise<void> {
    const id = `${user.id}_${guild.id}`;
    const dbUser = (await this.ensure(id, {
      count: 0,
      levelSent: 0,
    })) as {
      count: number;
      levelSent: number;
    };
    dbUser.count++;
    await this.set(id, dbUser);
    const level = this.calculatePoints(dbUser.count);
    if (dbUser.levelSent == level || level < 1 || level % 10 != 0) return;
    dbUser.levelSent = level;
    channel.send("Congratulations! You reached level " + level);
    await this.set(id, dbUser);
  }
}

export default {
  boot: Points,
  pluginName: "points",
  config: (bot: Hermes): boolean => bot.config.plugins.points.enabled,
};
