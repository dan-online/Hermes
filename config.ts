//@ts-ignore
import JoshProvider from "@joshdb/json";

export default {
  prefix: "h!",
  owners: ["709674034798788618"],
  color: 0x223040,
  josh: {
    provider: JoshProvider,
    options: {},
  },
  plugins: {
    points: {
      enabled: true,
    },
    economy: {
      enabled: true,
    },
    messages: {
      enabled: true,
      channel: "log",
      join: "Enjoy your stay here! Ping Dan in #general for help",
      leave: ":(",
    },
    mod: {
      enabled: true,
      nsfw: false,
      /*
      Drawing - safe for work drawings (including anime)
      Hentai - hentai and pornographic drawings
      Neutral - safe for work neutral images
      Porn - pornographic images, sexual acts
      Sexy - sexually explicit images, not pornography
      */
      nsfwAllow: ["Neutral", "Drawing"],
    },
  },
};
