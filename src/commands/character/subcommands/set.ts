import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from "discord.js";
import characterController from "../../../database/controllers/characterController";
import { UserInterface } from "../../../database/models/user";
import { activeCharacter } from "../../../selectMenus";
import { Subcommand } from "../../../typings/Subcommand";

export const set: Subcommand = {
  data: (subcommand) =>
    subcommand.setName("set").setDescription("Set your active character."),
  execute: async (interaction, user: UserInterface) => {
    await interaction.deferReply({ ephemeral: true });
    const characters = await characterController.findByUser(user.discordId);

    const selectMenu = activeCharacter.data;
    characters.forEach((character) => {
      selectMenu.addOptions({
        label: character.name,
        description: `${character.ancestry} ${character.class} ${character.level}`,
        value: character._id.toString(),
      });
    });

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
