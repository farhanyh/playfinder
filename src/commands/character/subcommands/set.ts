import { EmbedBuilder } from "discord.js";
import characterController from "../../../database/controllers/characterController";
import userController from "../../../database/controllers/userController";
import { UserInterface } from "../../../database/models/user";
import { Subcommand } from "../../../typings/Subcommand";

export const set: Subcommand = {
  data: (subcommand) =>
    subcommand
      .setName("set")
      .setDescription("Set your active character.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription(
            "Set your active character to the character with this name."
          )
          .setRequired(true)
      ),
  execute: async (interaction, user: UserInterface) => {
    await interaction.deferReply({ ephemeral: true });
    const selectedName = interaction.options.getString("name", true);
    const selectedCharacter = await characterController.findByName(
      selectedName
    );
    if (!selectedCharacter) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You have no character with this name.")
            .setFooter({ text: "To import a character, use `/import <url>`" }),
        ],
      });
      return;
    }
    await userController.edit(user.discordId, {
      activeCharacter: selectedCharacter._id,
    });
    await interaction.editReply({
      content: `Active character changed to ${selectedCharacter.name}`,
    });
  },
};
