import { GuildMember, Message } from "discord.js";

export default function (
  message: Message,
  args: string[]
): GuildMember | undefined {
  let member = message.mentions.members?.first();
  if (!member) {
    member = message.guild?.members.cache.get(
      `${BigInt(args.find((x) => x.length > 17) || "")}`
    );
  }
  if (!member) {
    member = message.guild?.members.cache.find(
      (x) => x.displayName == args.find((x) => isNaN(Number(x)))
    );
  }
  if (!member) {
    member = message.guild?.members.cache.find(
      (x) => x.user.username == args.find((x) => isNaN(Number(x)))
    );
  }
  return member;
}
