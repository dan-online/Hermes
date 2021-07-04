import Josh from "@joshdb/core";
import * as uuid from "uuid";
import { Guild, User } from "discord.js";
import { Hermes } from "../../bot";

type modGuild = { cases: Case[] };

export class Case {
  id = uuid.v4();
  reason: string;
  actor: User;
  user: User;
  guild: Guild;
  date: Date;
  action: string;
  constructor(
    guild: Guild,
    user: User,
    reason: string,
    actor: User,
    action: string
  ) {
    this.reason = reason;
    this.actor = actor;
    this.user = user;
    this.guild = guild;
    this.date = new Date();
    this.action = action;
  }
}

export class Mod extends Josh {
  constructor(Hermes: Hermes) {
    super({
      name: "mod",
      provider: Hermes.config.josh.provider,
      providerOptions: Hermes.config.josh.options,
    });
  }
  getGuild(guild: Guild): Promise<modGuild> {
    return this.ensure(guild.id, { cases: [] }) as Promise<modGuild>;
  }
  setProp(guild: Guild, key: string, val: any): Promise<unknown> {
    return this.set(guild.id + "." + key, val);
  }
  async addCase(
    guild: Guild,
    user: User,
    reason: string,
    actor: User,
    action: string
  ): Promise<Case> {
    const { cases } = await this.getGuild(guild);
    const newCase = new Case(guild, user, reason, actor, action);
    cases.push(newCase);
    await this.setProp(guild, "cases", cases);
    return newCase;
  }
}

export default {
  boot: Mod,
  pluginName: "mod",
  config: (bot: Hermes): boolean => bot.config.plugins.mod.enabled,
};
