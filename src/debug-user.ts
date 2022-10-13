import { supabaseAdmin } from "./supabase";

(async () => {
  await supabaseAdmin.auth.signInWithOAuth({
    provider: "discord",
  });
})();
