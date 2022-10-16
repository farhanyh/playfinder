import { SelectMenuBuilder } from "discord.js";
import { isValidObjectId, Types } from "mongoose";
import characterController from "../database/controllers/characterController";
import userController from "../database/controllers/userController";
import { errorEmbed } from "../embedTemplates/error";
import { SelectMenu } from "../typings/SelectMenu";

export const activeCharacter: SelectMenu = {
  data: new SelectMenuBuilder()
    .setCustomId("activeCharacter")
    .setPlaceholder("Nothing selected"),
  execute: async (interaction) => {
    await interaction.deferUpdate();
    if (interaction.values.length === 0) {
      await interaction.editReply({
        embeds: [errorEmbed("No character selected.")],
      });
      return;
    }
    const hexId = interaction.values[0];
    if (!isValidObjectId(hexId)) {
      await interaction.editReply({
        embeds: [errorEmbed("Invalid character id.")],
      });
      return;
    }
    const character = await characterController.read(new Types.ObjectId(hexId));
    if (!character) {
      await interaction.editReply({
        embeds: [errorEmbed("Failed to fetch character data.")],
      });
      return;
    }
    await userController.edit(character.user, {
      activeCharacter: character._id,
    });
    await interaction.editReply({
      content: `Active character changed to ${character.name}`,
      components: [],
      embeds: [],
    });
  },
};