import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../typings/Command";

const helpEmbed = new EmbedBuilder().setDescription(
  `This is a WIP discord bot that allows you to play/run [Pathfinder 2nd Edition](https://paizo.com/pathfinder) in Discord. Inspired by [Avrae](https://avrae.io/), this bot includes dice roller and initiative tracker.`
);

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on how to use this bot.")
    .addBooleanOption((input) =>
      input
        .setName("here")
        .setDescription(
          "Post the information in this channel instead of to your DM."
        )
    ),
  execute: async (interaction) => {
    if (interaction.guildId) {
      const { user, options } = interaction;
      if (!options.get("here")?.value) {
        await interaction.deferReply({ ephemeral: true });
        await user.send({ embeds: [helpEmbed] });
        await interaction.editReply({
          content: "I've sent a DM to you!",
        });
        return;
      }
    }
    await interaction.deferReply();
    await interaction.editReply({ embeds: [helpEmbed] });
  },
  prod: true,
};
