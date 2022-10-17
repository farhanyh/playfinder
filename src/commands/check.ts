import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import abilityNames from "../data/string/abilities.json";
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

    const user = await new User(interaction.user.id);
    const activeCharacter = await user.getActiveCharacter();
    if (!activeCharacter) {
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

    const activeCharacterData = await activeCharacter.getData();
    if (!activeCharacterData) {
      await interaction.editReply({
        embeds: [errorEmbed("Failed to load character data.")],
      });
      return;
    }

    const skill = interaction.options.getString("skill", true);
    const rollExpression = `1d20${formatMod(
      isAbility(skill)
        ? getAbilityMod(activeCharacterData.abilities, skill)
        : getSkillMod(activeCharacterData, skill)
    )}`;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            `${activeCharacterData.name} makes a ${
              abilityNames[skill as Ability | Skill]
            } check!`
          )
          .setThumbnail(activeCharacterData.avatar || null)
          .setDescription(`${rollExpression}: ${formatRoll(rollExpression)}`),
      ],
    });
  },
  prod: true,
};
