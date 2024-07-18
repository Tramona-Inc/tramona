import { Table } from "drizzle-orm";
import { type SupabaseDatabase } from "./supabase";

export type MessageDbType =
  SupabaseDatabase["public"]["Tables"]["messages"]["Row"];

export type GuestMessageType = SupabaseDatabase["public"]["Tables"]["guest_messages"]["Row"]