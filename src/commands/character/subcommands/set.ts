import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from "discord.js";
import { User } from "../../../database/models/user";
import { stringSearch } from "../../../helper/string";
import { activeCharacter } from "../../../selectMenus";
import { Subcommand } from "../../../typings/Subcommand";

export const set: Subcommand = {
  data: (subcommand) =>
    subcommand
      .setName("set")
      .setDescription("Set your active character.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of character you want to set as active.")
      ),
  execute: async (interaction, user: User) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      let characters = await user.getCharacters();

      const selectMenu = activeCharacter.data;
      selectMenu.options.length = 0;

      const setName = interaction.options.getString("name", false);
      if (setName) {
        const queryResults = stringSearch(
          setName,
          characters.map((character) => character.getData().name)
        );
        characters = characters.filter((character) =>
          queryResults.includes(character.getData().name)
        );
      }

      if (characters.length === 0) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder().setDescription(
              `You don't have a character${
                setName ? " with that name" : ""
              }, import them using \`/import <url>\``
            ),
          ],
        });
        return;
      }
      if (characters.length === 1) {
        const character = characters[0];
        await user.setActiveCharacter(character);
        await interaction.editReply({
          content: `Active character changed to ${character.getData().name}`,
        });
        return;
      }

      for (const character of characters) {
        const data = character.getData();
        selectMenu.addOptions({
          label: data.name,
          description: `${data.ancestry} ${data.class} ${data.level}`,
          value: data._id.toString(),
        });
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder().setTitle("Choose a character!").setFooter({
            text: "If you don't find your character, import them using `/import <url>`",
          }),
        ],
        components: [
          new ActionRowBuilder<SelectMenuBuilder>().addComponents(selectMenu),
        ],
      });
    } catch (error) {
      await interaction.editReply({ content: `${error}` });
    }
  },
};
