import { createCommandWithSubcommand } from "../../factories/commands";
import { Command } from "../../typings/Command";
import * as subcommandModules from "./subcommands";

export const wiki: Command = createCommandWithSubcommand(
  "wiki",
  "Lookup information about game terms.",
  true,
  subcommandModules
);
