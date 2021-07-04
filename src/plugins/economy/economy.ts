import Josh from "@joshdb/core";
import { Guild, GuildMember, User } from "discord.js";
import { Hermes } from "../../bot";

export class Economy extends Josh {
  constructor(Hermes: Hermes) {
    super({
      name: "economy",
      provider: Hermes.config.josh.provider,
      providerOptions: Hermes.config.josh.options,
    });
  }
  getUser(user: User | GuildMember, guild: Guild): Promise<number> {
    return this.ensure(user.id + "_" + guild.id, 0) as Promise<number>;
  }
  async setUser(
    user: User | GuildMember,
    guild: Guild,
    amount: number
  ): Promise<number> {
    await this.set(user.id + "_" + guild.id, amount);
    return amount;
  }
  async addUser(
    user: User | GuildMember,
    guild: Guild,
    toAdd: number
  ): Promise<number> {
    let amount = await this.getUser(user, guild);
    amount += toAdd;
    return this.setUser(user, guild, amount);
  }
}

export default {
  boot: Economy,
  pluginName: "economy",
  config: (Hermes: Hermes): boolean => Hermes.config.plugins.economy.enabled,
};
