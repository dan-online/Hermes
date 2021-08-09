// Credit: @curingme#0001

import {
  MessageActionRow,
  MessageButton,
  CommandInteraction,
  MessageComponentInteraction,
} from "discord.js";

export default async function (
  interaction: CommandInteraction,
  pages: []
): Promise<any> {
  // Creates the button component row.
  const row = [
    new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("PRIMARY")
          .setLabel("◄")
          .setDisabled(true)
          .setCustomId("back")
      )
      .addComponents(
        new MessageButton()
          .setStyle("PRIMARY")
          .setLabel("►")
          .setCustomId("next")
      )
      .addComponents(
        new MessageButton().setStyle("DANGER").setLabel("✖").setCustomId("end")
      ),
  ];
  // Sets the index used to navigation.
  let idx = 0;
  // Replies to the interacton.
  await interaction.reply({
    embeds: [pages[idx]],
    components: row,
  });
  // Creates the interaction collector.
  const collector = interaction.channel?.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
  });
  let message: MessageComponentInteraction;
  collector?.on("collect", async (i) => {
    message = i;
    // Goes back one page.
    if (i.customId === "back") {
      idx--;
      if (idx === 0) row[0].components[0].setDisabled(true);
      if (pages.length - 1 !== idx) row[0].components[1].setDisabled(false);
      await i.update({ embeds: [pages[idx]], components: row });
    }
    // Goes forward one page.
    else if (i.customId === "next") {
      idx++;
      if (idx !== 0) row[0].components[0].setDisabled(false);
      if (pages.length - 1 === idx) row[0].components[1].setDisabled(true);
      await i.update({ embeds: [pages[idx]], components: row });
    }
    // Ends the navigation.
    else if (i.customId === "end") collector.stop();
  });
  collector?.on("end", () => {
    try {
      message.update({ components: [] });
    } catch (error) {
      console.error(error);
    }
  });
}
