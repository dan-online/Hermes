import { Message } from "discord.js";
import path from "path";

import { Hermes } from "../../../bot";
import { CanvasManager } from "../../../managers/canvas";
import download from "../../../utils/download";
import formatNumber from "../../../utils/formatNumber";

export default {
  commandName: "level",
  aliases: ["levels", "l"],
  commandFn: async (Hermes: Hermes, message: Message): Promise<void> => {
    const cache = Hermes.fileCache;

    const { count } = await Hermes.plugins
      .get("points")
      .plugin.ensure(`${message.author.id}_${message.guild?.id}`, {
        count: 0,
        levelSent: 0,
      });
    const level = Hermes.plugins.get("points").plugin.calculatePoints(count);

    const id = "level-" + message.author.id + "-" + message.guild?.id;

    const check = await cache.check(id, level, ".jpg");

    if (check) {
      message.channel.send({
        files: [
          {
            attachment: await check,
            name: "level_" + message.author.id + ".jpg",
          },
        ],
      });
      return;
    }

    const width = 800;
    const height = 300;
    const canvas = new CanvasManager(height, width);
    const pfp = await download(
      message.author.displayAvatarURL({ format: "png", size: 512 })
    );
    const icon = message.guild
      ? message.guild.iconURL({ size: 512, format: "png" })
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

    canvas.addText(
      (message.member?.displayName || message.author.username).slice(0, 20),
      imageHeight + 70,
      100,
      "white",
      height * 0.2
    );
    canvas.addText(
      "Level " + Math.floor(level),
      imageHeight + 70,
      160,
      "white",
      height * 0.12
    );
    canvas.addProgress(
      level - Math.floor(level),
      "white",
      300,
      imageHeight + 75,
      200
    );
    canvas.addText(
      Math.round((level - Math.floor(level)) * 100) + "%",
      imageHeight + 70 + 330,
      207,
      "white",
      height * 0.1
    );

    await canvas.addImage(
      pfp,
      50,
      (height - imageHeight) / 2,
      imageHeight,
      imageHeight,
      true
    );

    const exported = canvas.export();

    message.channel.send({
      files: [
        {
          attachment: exported,
          name: "level_" + message.author.id + ".jpg",
        },
      ],
    });
    await cache.add(id + "-" + level + ".jpg", exported);
    return;
  },
};
