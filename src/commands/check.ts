import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import abilityNames from "../data/string/abilities.json";
import characterController from "../database/controllers/characterController";
import {
  getAbilityMod,
  getSkillMod,
} from "../database/models/character/methods";
import { User } from "../database/models/user";
import { errorEmbed } from "../embedTemplates/error";
import { formatMod } from "../helper/formatMod";
import { formatRoll } from "../roller";
import { Ability, isAbility, Skill } from "../typings/Character";
import { Command } from "../typings/Command";

export const check: Command = {
  data: (() => {
    const data = new SlashCommandBuilder()
      .setName("check")
      .setDescription("Roll a check using your active character.")
      .addStringOption((option) =>
        option
          .setName("skill")
          .setDescription("The check that is going to be made.")
          .addChoices(
            ...Object.keys(abilityNames).map((skill) => ({
              name: abilityNames[skill as Ability | Skill],
              value: skill,
            }))
          )
          .setRequired(true)
      );
    return data;
  })(),
  execute: async (interaction) => {
    await interaction.deferReply();

    const userData = await new User(interaction.user.id).getData();
    if (!userData.activeCharacter) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You have not set your active character yet.")
            .setFooter({
              text: "To change active characters, use `/character set`",
            }),
        ],
      });
      return;
    }

    const activeCharacter = await characterController.read(
      userData.activeCharacter
    );
    if (!activeCharacter) {
      await interaction.editReply({
        embeds: [errorEmbed("Failed to load character data.")],
      });
      return;
    }

    const skill = interaction.options.getString("skill", true);
    const rollExpression = `1d20${formatMod(
      isAbility(skill)
        ? getAbilityMod(activeCharacter.abilities, skill)
        : getSkillMod(activeCharacter, skill)
    )}`;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            `${activeCharacter.name} makes a ${
              abilityNames[skill as Ability | Skill]
            } check!`
          )
          .setThumbnail(activeCharacter.avatar || null)
          .setDescription(`${rollExpression}: ${formatRoll(rollExpression)}`),
      ],
    });
  },
  prod: true,
};
