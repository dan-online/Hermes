import { Hermes } from "../bot";
export default {
  eventName: "ready",
  eventFn: (Hermes: Hermes): void => {
    Hermes.logger.info(Hermes.user?.username + " online!");
  },
};
