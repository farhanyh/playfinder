import { Dispatcher } from "undici";
import BodyReadable from "undici/types/readable";

export const getJSONResponse = async (
  body: BodyReadable & Dispatcher.BodyMixin
) => {
  let fullBody = "";
  for await (const data of body) {
    fullBody += data.toString();
  }

  return JSON.parse(fullBody);
};
