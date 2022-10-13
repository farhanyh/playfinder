import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Creates a new help ticket.")
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Describe your problem.")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: "Help is on the way!",
  });
}
