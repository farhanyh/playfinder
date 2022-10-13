import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import helpEntries from "../data/helpEntries.json";
import { Command } from "../typings/Command";

const helpEmbed = new EmbedBuilder()
  .setDescription(helpEntries.description)
  .addFields(
    helpEntries.entries.map((category) => ({
      name: category.title,
      value: category.entries
        .map((entry) => `**${entry.title}** - ${entry.description}`)
        .join("\n"),
    }))
  );

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on how to use this bot.")
    .addBooleanOption((input) =>
      input
        .setName("here")
        .setDescription("Post the information to the channel instead of DM.")
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
