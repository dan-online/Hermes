import { GuildMember } from "discord.js";
import { Hermes } from "../../../bot";
import { Mod } from "../mod";

export default {
  eventName: "guildMemberAdd",
  eventFn: async (Hermes: Hermes, member: GuildMember): Promise<void> => {
    const mod = Hermes.plugins.get("mod").plugin as Mod;
    const { cases } = await mod.getGuild(member.guild);
    const ban = cases.find(
      (x) => x.user.id == member.id && x.action == "hackban"
    );
    if (ban) {
      member.ban({ reason: "Hackban: " + ban.reason });
    }
  },
};
