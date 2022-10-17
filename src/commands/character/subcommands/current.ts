import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import characterController from "../../../database/controllers/characterController";
import { UserInterface } from "../../../database/models/user";
import { characterSheetEmbed } from "../../../embedTemplates/characterSheet";
import { errorEmbed } from "../../../embedTemplates/error";
import { Subcommand } from "../../../typings/Subcommand";

export const showCurrentCharacterSheet = async (
  interaction: ChatInputCommandInteraction,
  userData: UserInterface
) => {
  await interaction.deferReply();
  if (!userData.activeCharacter) {
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
    userData.activeCharacter
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
};

export const current: Subcommand = {
  data: (subcommand) =>
    subcommand
      .setName("current")
      .setDescription("Shows your current active character."),
  execute: showCurrentCharacterSheet,
};
