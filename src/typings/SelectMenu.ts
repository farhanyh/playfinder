import { SelectMenuBuilder, SelectMenuInteraction } from "discord.js";

export interface SelectMenu {
  data: SelectMenuBuilder;
  execute: (interaction: SelectMenuInteraction) => Promise<void>;
}
