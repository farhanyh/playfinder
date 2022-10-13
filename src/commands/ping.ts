import { SlashCommandBuilder } from "discord.js";
import { Command } from "../typings/Command";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute: async (interaction) => {
    await interaction.reply("pong");
  },
  prod: true,
};
