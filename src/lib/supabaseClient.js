import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hjgikxpqdzyppkogqipa.supabase.co",
  "SUA_ANON_KEY"
);

export default supabase;