import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { User } from "../../database/models/user";
import { Command } from "../../typings/Command";
import { Subcommand } from "../../typings/Subcommand";
import * as subcommandModules from "./subcommands";

const subcommands = Object(subcommandModules);

export const character: Command = {
  data: (() => {
    const command = new SlashCommandBuilder()
      .setName("character")
      .setDescription("Manage your active character.");
    for (const module of Object.values<Subcommand>(subcommandModules)) {
      command.addSubcommand(module.data);
    }
    return command;
  })(),
  execute: async (interaction) => {
    const { user: discordUser } = interaction;
    const user = new User(discordUser.id);

    if ((await user.getCharacters()).length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You have no characters.")
            .setFooter({ text: "To import a character, use `/import <url>`" }),
        ],
      });
      return;
    }

    const subcommandName = interaction.options.getSubcommand();
    await subcommands[subcommandName].execute(interaction, user);
  },
  prod: true,
};
