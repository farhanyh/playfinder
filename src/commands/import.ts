import { SlashCommandBuilder } from "discord.js";
import { Types } from "mongoose";
import { request } from "undici";
import characterController from "../database/controllers/characterController";
import userController from "../database/controllers/userController";
import { CharacterInterface } from "../database/models/character";
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
      const user =
        (await userController.findByDiscordId(discordUser.id)) ||
        (await userController.add({
          discordId: discordUser.id,
          avatar: discordUser.avatar || undefined,
          username: discordUser.username,
          discriminator: discordUser.discriminator,
        }));

      const parsedData =
        characterController.parsePathbuilderJSON(characterData);
      if (!parsedData.name) {
        await interaction.editReply({
          content:
            "Failed to parse character data. Make sure you put the correct URL.",
        });
        return;
      }
      const dbCharacterData = await characterController.findByName(
        parsedData.name
      );
      const characterDataWithUser = {
        ...parsedData,
        user: user._id,
      };
      const finalCharacterData = dbCharacterData
        ? await characterController.edit(
            dbCharacterData._id,
            characterDataWithUser
          )
        : await characterController.add(characterDataWithUser);

      const { characters, ...userRest } = user;
      characters.push(finalCharacterData?._id);
      await userController.editByDiscordId(user.discordId, {
        ...userRest,
        characters,
      });

      await interaction.editReply({ content: `Imported character data!` });
    } catch (error) {
      await interaction.editReply({ content: `${error}` });
    }
  },
  prod: false,
};
