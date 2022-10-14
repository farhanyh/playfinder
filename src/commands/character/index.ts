import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import userController from "../../database/controllers/userController";
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
    const user = await userController.findByDiscordId(discordUser.id);

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

    const subcommandName = interaction.options.getSubcommand();
    await subcommands[subcommandName].execute(interaction, user);
  },
  prod: false,
};
