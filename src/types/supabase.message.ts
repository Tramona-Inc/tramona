import { SupabaseDatabase } from "./supabase";

export type MessageDbType =
  SupabaseDatabase["public"]["Tables"]["messages"]["Row"];
