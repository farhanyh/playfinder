import { SlashCommandBuilder } from "discord.js";
import { request } from "undici";
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
    const characterData = await getJSONResponse(
      (
        await request(importUrl)
      ).body
    );
    console.log(characterData);
    await interaction.editReply({ content: `Imported character data!` });
  },
  prod: false,
};
