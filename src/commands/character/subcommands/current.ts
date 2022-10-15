import { EmbedBuilder } from "discord.js";
import characterController from "../../../database/controllers/characterController";
import { UserInterface } from "../../../database/models/user";
import { characterSheetEmbed } from "../../../embedTemplates/characterSheet";
import { errorEmbed } from "../../../embedTemplates/error";
import { Subcommand } from "../../../typings/Subcommand";

export const current: Subcommand = {
  data: (subcommand) =>
    subcommand
      .setName("current")
      .setDescription("Shows your current active character."),
  execute: async (interaction, user: UserInterface) => {
    await interaction.deferReply();
    if (!user.activeCharacter) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You have not set your active character yet.")
            .setFooter({
              text: "To change active characters, use `/character <name>`",
            }),
        ],
      });
      return;
    }

    const activeCharacter = await characterController.read(
      user.activeCharacter
    );
    if (!activeCharacter) {
      await interaction.editReply({
        embeds: [errorEmbed("Failed to load character data.")],
      });
      return;
    }

    await interaction.editReply({
      embeds: [characterSheetEmbed(activeCharacter)],
    });
  },
};
