import { createClient } from "@supabase/supabase-js";
import config from "./config";

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
export const supabaseAdmin = createClient(
  config.SUPABASE_URL,
  config.SERVICE_KEY
);
