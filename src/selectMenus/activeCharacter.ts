import { SelectMenuBuilder } from "discord.js";
import { isValidObjectId, Types } from "mongoose";
import { Character } from "../database/models/character";
import { User } from "../database/models/user";
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
    try {
      const user = await User.createUser(interaction.user.id);
      const character = await user.setActiveCharacter(
        await Character.createCharacter(new Types.ObjectId(hexId))
      );
      await interaction.editReply({
        content: `Active character changed to ${character.getData().name}`,
        components: [],
        embeds: [],
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [errorEmbed((error as Error).message)],
      });
    }
  },
};
