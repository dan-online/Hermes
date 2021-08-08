import { GuildMember, TextChannel } from "discord.js";
import path from "path";

import { Hermes } from "../../../bot";
import { CanvasManager } from "../../../managers/canvas";
import download from "../../../utils/download";
import trim from "../../../utils/trim";

export default {
  eventName: "guildMemberRemove",
  eventFn: async (Hermes: Hermes, member: GuildMember): Promise<void> => {
    const config = Hermes.config.plugins.messages;
    const channel = member.guild.channels.cache.find(
      (x) => x.name == config.channel && x.type == "GUILD_TEXT"
    ) as unknown as TextChannel;

    const height = 200;
    const width = 600;
    const canvas = new CanvasManager(200, 600);
    const pfp = await download(
      member.user.displayAvatarURL({ format: "png", size: 512 })
    );
    const icon = member.guild
      ? member.guild.iconURL({ size: 512, format: "png" })
      : null;

    let pfg;
    if (icon) {
      pfg = icon;
    } else {
      pfg = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "assets",
        "images",
        "default.jpg"
      );
    }

    const imageHeight = 0.75 * height;

    await canvas.addBackgroundImage(pfg);

    await canvas.addText(
      "There goes " + trim(member.displayName, 12) + "!",
      20,
      55,
      "white",
      height * 0.17
    );

    // await canvas.addText(
    //   "You are member #" + member.guild.memberCount,
    //   22,
    //   89,
    //   "white",
    //   height * 0.1
    // );
    await canvas.wrapText(
      config.leave,
      22,
      100,
      "white",
      height * 0.12,
      width - imageHeight - 80,
      40
    );

    await canvas.addImage(
      pfp,
      width - 50 - imageHeight,
      (height - imageHeight) / 2,
      imageHeight,
      imageHeight,
      true,
      true
    );

    const exported = canvas.export();

    channel.send({
      files: [
        {
          attachment: exported,
          name: "leave_" + member.id + ".jpg",
        },
      ],
    });
    // await cache.add(id + "-" + level + ".jpg", exported);
  },
};
