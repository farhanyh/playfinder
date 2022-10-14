import { EmbedBuilder } from "discord.js";

export const errorEmbed = (message: string) => {
  return new EmbedBuilder()
    .setTitle("Oops! Something went wrong!")
    .setDescription(message);
};
