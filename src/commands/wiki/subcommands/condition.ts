import { AxiosError } from "axios";
import { EmbedBuilder } from "discord.js";
import { getCondition } from "../../../library";
import { Subcommand } from "../../../typings/Subcommand";

export const condition: Subcommand = {
  data: (subcommand) =>
    subcommand
      .setName("condition")
      .setDescription("Lookup information about condition.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the condition you're looking for.")
          .setRequired(true)
      ),
  execute: async (interaction) => {
    await interaction.deferReply();

    try {
      const condition = await getCondition(
        interaction.options.getString("name", true)
      );

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(condition.name)
            .setDescription(condition.description),
        ],
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        await interaction.editReply({
          content: error.message,
        });
      }
    }
  },
};
