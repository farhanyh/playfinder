import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../typings/Command";
import { Subcommand } from "../typings/Subcommand";

export const createCommandWithSubcommand = (
  name: string,
  desc: string,
  prod: boolean,
  subcommandModules: any,
  callback?: (
    interaction: ChatInputCommandInteraction
  ) => Promise<{ cont: boolean; [key: string]: any }>
): Command => {
  const subcommands = Object(subcommandModules);
  return {
    data: (() => {
      const command = new SlashCommandBuilder()
        .setName(name)
        .setDescription(desc);
      for (const module of Object.values<Subcommand>(subcommandModules)) {
        command.addSubcommand(module.data);
      }
      return command;
    })(),
    execute: async (interaction) => {
      const subcommandName = interaction.options.getSubcommand();
      if (callback) {
        const { cont, ...additionalArgs } = await callback(interaction);
        if (!cont) return;
        if (additionalArgs) {
          await subcommands[subcommandName].execute(
            interaction,
            ...Object.keys(additionalArgs).map((key) => additionalArgs[key])
          );
        } else await subcommands[subcommandName].execute(interaction);
      } else await subcommands[subcommandName].execute(interaction);
    },
    prod,
  };
};
