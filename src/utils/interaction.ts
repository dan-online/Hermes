import {
  Message,
  MessageButton,
  MessageButtonOptions,
  MessageComponentInteraction,
} from "discord.js";

export default async function (
  question: string,
  message: Message,
  buttons: MessageButtonOptions[]
): Promise<{
  interaction: MessageComponentInteraction;
  m: Message;
  update: (text: string) => void;
}> {
  const components: MessageButton[] = [];
  for (const button of buttons) {
    components.push(new MessageButton(button));
  }
  const m = await message.channel.send({
    content: question,
    components: [
      {
        type: 1,
        components,
      },
    ],
  });
  const interaction = await m.awaitMessageComponent();
  function update(text: string) {
    const disabled = [];
    for (const component of components) {
      component.setDisabled(true);
      disabled.push(component);
    }
    interaction.update({
      content: text,
      components: [{ type: 1, components: disabled }],
    });
  }
  return { interaction, m, update };
}
