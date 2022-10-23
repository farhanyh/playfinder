import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { User } from "../database/models/user";
import { errorEmbed } from "../embedTemplates/error";
import { formatMod } from "../helper/formatMod";
import defenseNames from "../data/string/defenses.json";
import { Command } from "../typings/Command";
import { Defense } from "../typings/Character";
import { formatRoll } from "../roller";

export const save: Command = {
  data: new SlashCommandBuilder()
    .setName("save")
    .setDescription("Makes a saving throw with your active character.")
    .addStringOption((option) =>
      option
        .setName("save")
        .setDescription("The defense you're going to use for the roll.")
        .setRequired(true)
        .addChoices(
          ...Object.keys(defenseNames).map((defense) => ({
            name: defenseNames[defense as Defense],
            value: defense,
          }))
        )
    )
    .addIntegerOption((option) =>
      option.setName("bonus").setDescription("Bonus/penalty to the roll.")
    ),
  execute: async (interaction) => {
    await interaction.deferReply();

    const user = await User.createUser(interaction.user.id);
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

    try {
      const activeCharacterData = activeCharacter.getData();

      const save = interaction.options.getString("save", true);
      const mod = interaction.options.getInteger("bonus");

      const rollExpression = `1d20${formatMod(
        activeCharacter.getSkillMod(save)
      )}${mod ? formatMod(mod) : ""}`;

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              `${activeCharacterData.name} makes a ${
                defenseNames[save as Defense]
              } save!`
            )
            .setThumbnail(activeCharacterData.avatar || null)
            .setDescription(`${rollExpression}: ${formatRoll(rollExpression)}`),
        ],
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [errorEmbed((error as Error).message)],
      });
    }
  },
  prod: true,
};
