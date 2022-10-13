import { REST, Routes } from "discord.js";
import * as commandModules from "./commands";
import config from "./config";
import { Command } from "./typings/Command";

const prodCommands = [];
const devCommands = [];

for (const module of Object.values<Command>(commandModules)) {
  if (module.prod) prodCommands.push(module.data);
  else devCommands.push(module.data);
}

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
    body: devCommands,
  })
  .then(() => console.log("Successfully registered dev commands."))
  .catch(console.error);

rest
  .put(Routes.applicationCommands(config.CLIENT_ID), { body: prodCommands })
  .then(() => console.log("Successfully registered production commands."))
  .catch(console.error);
