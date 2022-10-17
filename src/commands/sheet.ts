import { SlashCommandBuilder } from "discord.js";
import { User } from "../database/models/user";
import { Command } from "../typings/Command";
import { showCurrentCharacterSheet } from "./character/subcommands/current";

export const sheet: Command = {
  data: new SlashCommandBuilder()
    .setName("sheet")
    .setDescription("Shows current active character sheet."),
  execute: async (interaction) => {
    showCurrentCharacterSheet(
      interaction,
      await User.createUser(interaction.user.id)
    );
  },
  prod: true,
};
