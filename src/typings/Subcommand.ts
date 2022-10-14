import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

export interface Subcommand {
  data:
    | SlashCommandSubcommandBuilder
    | ((
        subcommandGroup: SlashCommandSubcommandBuilder
      ) => SlashCommandSubcommandBuilder);
  execute: (
    interaction: ChatInputCommandInteraction,
    ...args: any[]
  ) => Promise<void>;
}
