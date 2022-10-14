import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Types } from "mongoose";
import characterController from "../../database/controllers/characterController";
import userController from "../../database/controllers/userController";
import { UserInterface } from "../../database/models/user";
import { errorEmbed } from "../../embedTemplates/error";
import { Command } from "../../typings/Command";

const showCurrent = async (
  interaction: CommandInteraction,
  user: UserInterface
) => {
  await interaction.deferReply();
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
    embeds: [
      new EmbedBuilder()
        .setTitle(activeCharacter.name)
        .setThumbnail(activeCharacter.avatar || null)
        .setDescription(
          `Your current active character is ${activeCharacter.name}. All of your checks, saves and actions will use this character's stats.`
        )
        .setFooter({
          text: "To change active characters, use `/character <name>`",
        }),
    ],
  });
};

const setActive = async (
  interaction: CommandInteraction,
  user: UserInterface & {
    _id: Types.ObjectId;
  },
  name: string
) => {
  await interaction.deferReply({ ephemeral: true });
  const selectedCharacter = await characterController.findByName(name);
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
};

export const character: Command = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Shows your current active character.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          "Set your active character to the character with this name."
        )
    ),
  execute: async (interaction) => {
    const { user: discordUser } = interaction;
    const user = await userController.read(discordUser.id);

    if (!user || user.characters.length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You have no characters.")
            .setFooter({ text: "To import a character, use `/import <url>`" }),
        ],
      });
      return;
    }

    const selectedName = interaction.options.get("name");

    if (selectedName) {
      await setActive(interaction, user, selectedName.value as string);
      return;
    }

    await showCurrent(interaction, user);
  },
  prod: false,
};
