import { AxiosError } from "axios";
import { EmbedBuilder } from "discord.js";
import { getAncestry, getTraitById } from "../../../library";
import { Subcommand } from "../../../typings/Subcommand";

export const ancestry: Subcommand = {
  data: (subcommand) =>
    subcommand
      .setName("ancestry")
      .setDescription("Lookup information about ancestry.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the ancestry you're looking for.")
          .setRequired(true)
      ),
  execute: async (interaction) => {
    await interaction.deferReply();

    try {
      const ancestry = await getAncestry(
        interaction.options.getString("name", true)
      );
      const traits: string[] = [];
      if (ancestry.tagID)
        traits.push((await getTraitById(ancestry.tagID)).name.toUpperCase());
      traits.push("HUMANOID");

      await interaction.editReply({
        embeds: [
          new EmbedBuilder().setTitle(ancestry.name).addFields([
            { name: "Traits", value: traits.join("\n"), inline: true },
            {
              name: "Hit Points",
              value: `${ancestry.hitPoints}`,
              inline: true,
            },
            { name: "Size", value: ancestry.size, inline: true },
            { name: "Speed", value: `${ancestry.speed} feet`, inline: true },
            {
              name: "Ability Boosts",
              value: ancestry.boosts.join(", "),
              inline: true,
            },
            {
              name: "Ability Flaws",
              value:
                ancestry.flaws.length > 0 ? ancestry.flaws.join(", ") : "-",
              inline: true,
            },
            {
              name: "Languages",
              value: ancestry.languages.join("\n"),
              inline: true,
            },
          ]),
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
