import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Types } from "mongoose";
import characterController from "../../../database/controllers/characterController";
import userController from "../../../database/controllers/userController";
import { UserInterface } from "../../../database/models/user";
import { characterSheetEmbed } from "../../../embedTemplates/characterSheet";
import { errorEmbed } from "../../../embedTemplates/error";
import { Subcommand } from "../../../typings/Subcommand";

export const showCurrentCharacterSheet = async (
  interaction: ChatInputCommandInteraction,
  user: UserInterface
) => {
  await interaction.deferReply();
  if (!user)
    user = (await userController.findByDiscordId(
      interaction.user.id
    )) as UserInterface & {
      _id: Types.ObjectId;
    };
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

  const activeCharacter = await characterController.read(user.activeCharacter);
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
