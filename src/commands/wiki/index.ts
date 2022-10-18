import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../typings/Command";
import { Subcommand } from "../../typings/Subcommand";
import * as subcommandModules from "./subcommands";

const subcommands = Object(subcommandModules);

export const wiki: Command = {
  data: (() => {
    const command = new SlashCommandBuilder()
      .setName("wiki")
      .setDescription("Lookup information about game terms.");
    for (const module of Object.values<Subcommand>(subcommandModules)) {
      command.addSubcommand(module.data);
    }
    return command;
  })(),
  execute: async (interaction) => {
    const subcommandName = interaction.options.getSubcommand();
    await subcommands[subcommandName].execute(interaction);
  },
  prod: true,
};
