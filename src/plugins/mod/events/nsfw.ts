import { Message, TextChannel } from "discord.js";
import axios from "axios";
import * as nsfw from "nsfwjs";
import * as tf from "@tensorflow/tfjs-node";

tf.enableProdMode();

import { Hermes } from "../../../bot";

let model: null | nsfw.NSFWJS;
async function loadModel(): Promise<nsfw.NSFWJS> {
  if (model) {
    return model;
  }
  const _model = await nsfw.load();
  model = _model;
  return model;
}
export default {
  eventName: "message",
  eventFn: async (Hermes: Hermes, message: Message): Promise<void> => {
    const config = Hermes.config.plugins.mod;
    if (!config.nsfw) {
      return;
    }
    if (!config.nsfwAllow) {
      config.nsfwAllow = ["Neutral"];
    }
    const channel = message.channel as TextChannel;
    if (message.author.bot || channel.nsfw) return;
    const model = await loadModel();

    if (message.attachments.size > 0) {
      for (const [_id, attachment] of message.attachments[Symbol.iterator]()) {
        if (attachment.contentType?.startsWith("image")) {
          const pic = (await axios.get(attachment.proxyURL, {
            responseType: "arraybuffer",
          })) as { data: Buffer };
          let predictions: { className: string; probability: number }[] = [];
          if (attachment.contentType.split("gif").length < 2) {
            const image = (await tf.node.decodeImage(
              pic.data,
              3
            )) as tf.Tensor3D;
            predictions = await model.classify(image);
            image.dispose();
          } else {
            const allPreds = await model.classifyGif(pic.data, {
              fps: 2,
            });
            const all = [];
            for (const frame of allPreds) {
              for (const pred of frame) {
                const idx = all.findIndex(
                  (x) => x.pred.className == pred.className
                );
                if (idx < 0) {
                  all.push({ pred, number: 1 });
                } else {
                  all[idx].number++;
                  all[idx].pred.probability += pred.probability;
                }
              }
            }
            for (const each of all) {
              each.pred.probability = each.pred.probability / each.number;
              predictions.push(each.pred);
            }
            predictions.sort((a, b) => b.probability - a.probability);
          }
          if (!config.nsfwAllow.includes(predictions[0].className)) {
            message.delete();
            message.channel
              .send(
                "This message was deleted for violating NSFW: " +
                  predictions[0].className +
                  " at " +
                  Math.round(predictions[0].probability * 100) +
                  "%"
              )
              .then((m) => {
                setTimeout(m.delete, 3000);
              });
          }
        }
      }
    }
  },
};
