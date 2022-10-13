import dotenv from "dotenv";

dotenv.config();

const {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  SUPABASE_URL,
  SUPABASE_KEY,
  SERVICE_KEY,
} = process.env;

if (
  !CLIENT_ID ||
  !GUILD_ID ||
  !DISCORD_TOKEN ||
  !SUPABASE_URL ||
  !SUPABASE_KEY ||
  !SERVICE_KEY
) {
  throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  SUPABASE_URL,
  SUPABASE_KEY,
  SERVICE_KEY,
};

export default config;
