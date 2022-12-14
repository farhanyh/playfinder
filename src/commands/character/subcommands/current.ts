import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { User } from "../../../database/models/user";
import { characterSheetEmbed } from "../../../embedTemplates/characterSheet";
import { Subcommand } from "../../../typings/Subcommand";

export const showCurrentCharacterSheet = async (
  interaction: ChatInputCommandInteraction,
  user: User
) => {
  await interaction.deferReply();
  const activeCharacter = await user.getActiveCharacter();
  if (!activeCharacter) {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription("You have not set your active character yet.")
          .setFooter({
            text: "To change active characters, use `/character set`",
          }),
      ],
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
