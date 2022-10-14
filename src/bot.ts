import {
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
  SelectMenuInteraction,
} from "discord.js";
import * as commandModules from "./commands";
import * as selectMenusModules from "./selectMenus";
import config from "./config";

const commands = Object(commandModules);
const selectMenus = Object(selectMenusModules);

const chatInputCommandHandler = (interaction: ChatInputCommandInteraction) => {
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
};

const selectMenuHandler = (interaction: SelectMenuInteraction) => {
  const { customId } = interaction;
  selectMenus[customId].execute(interaction, client);
};

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", () => {
  console.log("Discord bot ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    chatInputCommandHandler(interaction);
    return;
  }
  if (interaction.isSelectMenu()) {
    selectMenuHandler(interaction);
    return;
  }
  return;
});

client.login(config.DISCORD_TOKEN);
