import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Supabase is optional — the app works without it (auth + saves are disabled).
// A missing URL causes createClient to throw, which crashes React on startup.
// We guard against that here so articles still load without env vars.
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
      "Auth and saves are disabled until these env vars are configured."
  );
  // Create a no-op client pointed at a placeholder so imports don't break
  supabase = createClient("https://placeholder.supabase.co", "placeholder");
}

export { supabase };
