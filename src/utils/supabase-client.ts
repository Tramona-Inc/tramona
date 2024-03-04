import { env } from "@/env";
import { type SupabaseDatabase } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient<SupabaseDatabase>(supabaseUrl, supabaseAnonKey);

export default supabase;
