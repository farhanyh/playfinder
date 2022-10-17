import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from "discord.js";
import { User } from "../../../database/models/user";
import { activeCharacter } from "../../../selectMenus";
import { Subcommand } from "../../../typings/Subcommand";

export const set: Subcommand = {
  data: (subcommand) =>
    subcommand.setName("set").setDescription("Set your active character."),
  execute: async (interaction, user: User) => {
    await interaction.deferReply({ ephemeral: true });
    const characters = await user.getCharacters();

    const selectMenu = activeCharacter.data;
    for (const character of characters) {
      const data = await character.getData();
      if (data)
        selectMenu.addOptions({
          label: data.name,
          description: `${data.ancestry} ${data.class} ${data.level}`,
          value: character.id.toString(),
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
  },
};
