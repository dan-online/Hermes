import { CommandInteraction, GuildMember } from "discord.js";
import path from "path";
import { Hermes } from "../../../bot";
import { CanvasManager } from "../../../managers/canvas";
import download from "../../../utils/download";
import formatNumber from "../../../utils/formatNumber";

export default {
  commandName: "balance",
  aliases: ["bal", "b"],
  slash: {
    name: "balance",
    description: "View your balance in the guild economy",
  },
  commandFn: async (
    Hermes: Hermes,
    interaction: CommandInteraction
  ): Promise<void> => {
    const cache = Hermes.fileCache;

    const bal = await Hermes.plugins
      .get("economy")
      .plugin.getUser(interaction.user, interaction.guild);

    const id = "balance-" + interaction.user.id + "-" + interaction.guild?.id;

    const check = await cache.check(id, bal);

    if (check) {
      interaction.reply({
        files: [
          {
            attachment: await check,
            name: "balance_" + interaction.user.id + ".jpg",
          },
        ],
      });
      return;
    }

    const width = 800;
    const height = 300;
    const canvas = new CanvasManager(height, width);
    const pfp = await download(
      interaction.user.displayAvatarURL({ format: "png", size: 512 })
    );
    const icon = interaction.guild
      ? interaction.guild.iconURL({ size: 512, format: "png" })
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
      (
        (interaction.member as GuildMember).displayName ||
        interaction.user.username
      ).slice(0, 20),
      imageHeight + 70,
      100,
      "white",
      height * 0.2
    );
    canvas.addText(
      "Bank of " + interaction.guild?.name,
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

    interaction.reply({
      files: [
        {
          attachment: exported,
          name: "balance_" + interaction.user.id + ".jpg",
        },
      ],
    });
    await cache.add(id + "-" + bal + ".jpg", exported);
    return;
  },
};
