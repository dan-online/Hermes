import { Message } from "discord.js";
import path from "path";
import { Hermes } from "../../../bot";
import { CanvasManager } from "../../../managers/canvas";
import download from "../../../utils/download";
import formatNumber from "../../../utils/formatNumber";

export default {
  commandName: "balance",
  aliases: ["bal", "b"],
  commandFn: async (Hermes: Hermes, message: Message): Promise<void> => {
    const cache = Hermes.fileCache;

    const bal = await Hermes.plugins
      .get("economy")
      .plugin.getUser(message.author, message.guild);

    const id = "balance-" + message.author.id + "-" + message.guild?.id;

    const check = await cache.check(id, bal, ".jpg");

    if (check) {
      message.channel.send({
        files: [
          {
            attachment: await check,
            name: "balance_" + message.author.id + ".jpg",
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
      "Bank of " + message.guild?.name,
      imageHeight + 70,
      150,
      "white",
      height * 0.1
    );
    canvas.addText(
      "$" + formatNumber(bal),
      imageHeight + 70,
      220,
      "white",
      height * 0.2
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
          name: "balance_" + message.author.id + ".jpg",
        },
      ],
    });
    await cache.add(id + "-" + bal + ".jpg", exported);
    return;
  },
};
