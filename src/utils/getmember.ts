import { GuildMember, Message } from "discord.js";

export default function (
  message: Message,
  args: string[]
): { member: GuildMember | undefined; reason: string } {
  let member = message.mentions.members?.first();
  let reason = "N/A";
  if (member) {
    const id = member.id;
    reason = args.filter((x) => x.split(id).length == 1).join(" ");
  }
  if (!member) {
    const id: `${bigint}` = `${BigInt(args.find((x) => x.length > 17) || "")}`;
    member = message.guild?.members.cache.get(id);
    if (member) {
      reason = args.filter((x) => x != id).join(" ");
    }
  }
  if (!member) {
    const name: string | undefined = args.find((x) => isNaN(Number(x)));
    member = message.guild?.members.cache.find((x) => x.displayName == name);
    if (member) {
      reason = args.filter((x) => x != name).join(" ");
    }
  }
  if (!member) {
    const username: string | undefined = args.find((x) => isNaN(Number(x)));
    member = message.guild?.members.cache.find(
      (x) => x.user.username == username
    );
    if (member) {
      reason = args.filter((x) => x != username).join(" ");
    }
  }
  if (reason.length < 1) {
    reason = "N/A";
  }
  return { member, reason };
}
