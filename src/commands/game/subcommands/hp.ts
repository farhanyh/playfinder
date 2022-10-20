import { User } from "../../../database/models/user";
import { errorEmbed } from "../../../embedTemplates/error";
import { successEmbed } from "../../../embedTemplates/success";
import { formatMod } from "../../../helper/formatMod";
import { Subcommand } from "../../../typings/Subcommand";

export const hp: Subcommand = {
  data: (subcommand) =>
    subcommand
      .setName("hp")
      .setDescription("Modifies the HP of the current active character.")
      .addIntegerOption((option) =>
        option
          .setName("hp")
          .setDescription("The number to modify the HP with.")
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("set")
          .setDescription(
            "Modify whether this command set or modify the current HP."
          )
      ),
  execute: async (interaction) => {
    await interaction.deferReply();
    const user = await User.createUser(interaction.user.id);
    const character = await user.getActiveCharacter();
    if (!character) {
      await interaction.editReply({
        embeds: [errorEmbed("You have not set your active character")],
      });
      return;
    }
    const amount = interaction.options.getInteger("hp", true);
    const set = interaction.options.getBoolean("set") || false;
    const {
      new: newHp,
      diff,
      name,
      max,
    } = await character.modifyHp(amount, set);
    await interaction.editReply({
      embeds: [successEmbed(`${name}: ${newHp}/${max} (${formatMod(diff)})`)],
    });
  },
};
