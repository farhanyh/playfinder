import { createCommandWithSubcommand } from "../../factories/commands";
import { Command } from "../../typings/Command";
import * as subcommandModules from "./subcommands";

export const game: Command = createCommandWithSubcommand(
  "game",
  "Help track character information in a game.",
  true,
  subcommandModules
);
