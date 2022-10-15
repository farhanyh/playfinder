import { SlashCommandBuilder } from "discord.js";
import { Command } from "../typings/Command";
import { showCurrentCharacterSheet } from "./character/subcommands/current";

export const sheet: Command = {
  data: new SlashCommandBuilder()
    .setName("sheet")
    .setDescription("Shows current active character sheet."),
  execute: showCurrentCharacterSheet,
  prod: true,
};
