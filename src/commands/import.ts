import { SlashCommandBuilder } from "discord.js";
import { request } from "undici";
import characterController from "../database/controllers/characterController";
import { initCharacter } from "../database/models/character/methods";
import { User } from "../database/models/user";
import { Command } from "../typings/Command";
import { getJSONResponse } from "../undici";

export const importCmd: Command = {
  data: new SlashCommandBuilder()
    .setName("import")
    .setDescription("Import character sheet from Pathbuilder 2.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription(
          "JSON export URL from Pathbuilder 2. (e.g. https://pathbuilder2e.com/json.php?id=111111)"
        )
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const importUrl = interaction.options.get("url", true).value as string;
    try {
      const characterData = await getJSONResponse(
        (
          await request(importUrl)
        ).body
      );
      if (!characterData.success) {
        await interaction.editReply({
          content:
            "Failed to parse character data. Make sure you put the correct URL.",
        });
        return;
      }

      const { user: discordUser } = interaction;
      const user = new User(discordUser.id);
      await user.setData({
        discordId: discordUser.id,
        avatar: discordUser.avatar || undefined,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
      });
      const userData = await user.getData();

      const parsedData =
        characterController.parsePathbuilderJSON(characterData);
      if (!parsedData.name) {
        await interaction.editReply({
          content:
            "Failed to parse character data. Make sure you put the correct URL.",
        });
        return;
      }
      const dbCharacterData = await characterController.findByUserAndName(
        discordUser.id,
        parsedData.name
      );
      const characterDataWithUser = {
        ...parsedData,
        user: userData._id,
      };
      const initedCharacterData = initCharacter(characterDataWithUser);
      const finalCharacterData = dbCharacterData
        ? await characterController.edit(
            dbCharacterData._id,
            initedCharacterData
          )
        : await characterController.add({
            ...initedCharacterData,
            currentHp: initedCharacterData.maxHp,
          });
      if (!finalCharacterData) {
        await interaction.editReply({
          content: "Failed to save character data.",
        });
        return;
      }

      const { characters } = userData;
      characters.push(finalCharacterData._id);
      await user.setData({
        characters: characters.filter(
          (value, index, self) =>
            self.findIndex((v) => v.toString() === value.toString()) === index
        ),
        activeCharacter: finalCharacterData._id,
      });

      await interaction.editReply({
        content: `Imported character data!`,
      });
    } catch (error) {
      await interaction.editReply({ content: `${error}` });
    }
  },
  prod: true,
};
