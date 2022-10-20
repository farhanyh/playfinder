import { EmbedBuilder } from "discord.js";

export const successEmbed = (message: string) => {
  return new EmbedBuilder().setDescription(message);
};
