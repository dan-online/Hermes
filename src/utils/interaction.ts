import {
  ButtonInteraction,
  CommandInteraction,
  MessageButton,
  MessageButtonOptions,
} from "discord.js";

export default function (
  question: string,
  interaction: CommandInteraction,
  buttons: MessageButtonOptions[]
): Promise<{
  interaction?: ButtonInteraction;
  update: (text: string) => void;
}> {
  return new Promise((res, rej) => {
    const components: MessageButton[] = [];
    for (const button of buttons) {
      components.push(new MessageButton(button));
    }
    interaction.editReply({
      content: question,
      components: [
        {
          type: 1,
          components,
        },
      ],
    });

    function update(text: string) {
      const disabled = [];
      for (const component of components) {
        component.setDisabled(true);
        disabled.push(component);
      }
      interaction?.editReply({
        content: text,
        components: [],
      });
    }
    const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 60000,
      max: 1,
    });
    collector?.on("end", (collected) => {
      if (collected.size == 0) {
        return rej("No answer specified within 60s");
      }
      res({ interaction: collected.first(), update });
    });

    // return { interaction: newInteraction, update };
  });
}
