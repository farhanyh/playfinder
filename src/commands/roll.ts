import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { formatRoll } from "../roller";
import { Command } from "../typings/Command";

export const roll: Command = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll some dice.")
    .addStringOption((option) =>
      option
        .setName("expression")
        .setDescription("The dice expression you want to roll.")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply();
    const { user, options } = interaction;
    const expression = options.getString("expression", true);
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${user.username} rolled some dice!`)
          .setDescription(`${expression}: ${formatRoll(expression)}`),
      ],
    });
  },
  prod: true,
};
