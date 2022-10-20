import { EmbedBuilder } from "discord.js";
import { User } from "../../database/models/user";
import { createCommandWithSubcommand } from "../../factories/commands";
import { Command } from "../../typings/Command";
import * as subcommandModules from "./subcommands";

export const character: Command = createCommandWithSubcommand(
  "character",
  "Manage your active character.",
  true,
  subcommandModules,
  async (interaction) => {
    const { user: discordUser } = interaction;
    const user = await User.createUser(discordUser.id);

    if ((await user.getCharacters()).length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You have no characters.")
            .setFooter({ text: "To import a character, use `/import <url>`" }),
        ],
      });
      return { cont: false };
    }
    return { cont: true, user };
  }
);
