import dotenv from "dotenv";

dotenv.config();

const {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  MONGO_URI,
  WG_BASE_URL,
  WG_CLIENT_ID,
  WG_API_KEY,
} = process.env;

if (
  !CLIENT_ID ||
  !GUILD_ID ||
  !DISCORD_TOKEN ||
  !MONGO_URI ||
  !WG_BASE_URL ||
  !WG_CLIENT_ID ||
  !WG_API_KEY
) {
  throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  MONGO_URI,
  WG_BASE_URL,
  WG_CLIENT_ID,
  WG_API_KEY,
};

export default config;
