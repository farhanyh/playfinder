import dotenv from "dotenv";

dotenv.config();

const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN, MONGO_URI } = process.env;

if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN || !MONGO_URI) {
  throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  MONGO_URI,
};

export default config;
