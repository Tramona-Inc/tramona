export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SupabaseDatabase = {
  public: {
    Tables: {
      account: {
        Row: {
          access_token: string | null;
          expires_at: number | null;
          id_token: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token: string | null;
          scope: string | null;
          session_state: string | null;
          token_type: string | null;
          type: string;
          userId: string;
        };
        Insert: {
          access_token?: string | null;
          expires_at?: number | null;
          id_token?: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type: string;
          userId: string;
        };
        Update: {
          access_token?: string | null;
          expires_at?: number | null;
          id_token?: string | null;
          provider?: string;
          providerAccountId?: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "account_userId_user_id_fk";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      conversation_participants: {
        Row: {
          conversation_id: string;
          user_id: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
        };
        Update: {
          conversation_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_conversations_id_fk";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversation_participants_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      host_profiles: {
        Row: {
          became_host_at: string;
          charges_enabled: boolean | null;
          profile_url: string | null;
          stripeAccountId: string | null;
          type: SupabaseDatabase["public"]["Enums"]["host_type"];
          user_id: string;
        };
        Insert: {
          became_host_at?: string;
          charges_enabled?: boolean | null;
          profile_url?: string | null;
          stripeAccountId?: string | null;
          type?: SupabaseDatabase["public"]["Enums"]["host_type"];
          user_id: string;
        };
        Update: {
          became_host_at?: string;
          charges_enabled?: boolean | null;
          profile_url?: string | null;
          stripeAccountId?: string | null;
          type?: SupabaseDatabase["public"]["Enums"]["host_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "host_profiles_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          conversation_id: string;
          created_at: string;
          id: string;
          is_edit: boolean | null;
          message: string;
          read: boolean | null;
          user_id: string;
        };
        Insert: {
          conversation_id: string;
          created_at?: string;
          id: string;
          is_edit?: boolean | null;
          message: string;
          read?: boolean | null;
          user_id: string;
        };
        Update: {
          conversation_id?: string;
          created_at?: string;
          id?: string;
          is_edit?: boolean | null;
          message?: string;
          read?: boolean | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_conversations_id_fk";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      flagged_messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string | null;
          confidence: number;
          violation_type: "OFF_PLATFORM_BOOKING" | "CONTACT_INFO" | "INAPPROPRIATE" | "UNKNOWN";
          message: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          conversation_id: string;
          user_id?: string | null;
          confidence: number;
          violation_type: "OFF_PLATFORM_BOOKING" | "CONTACT_INFO" | "INAPPROPRIATE" | "UNKNOWN";
          message: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          user_id?: string | null;
          confidence?: number;
          violation_type?: "OFF_PLATFORM_BOOKING" | "CONTACT_INFO" | "INAPPROPRIATE" | "UNKNOWN";
          message?: string;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flagged_messages_conversation_id_conversations_id_fk";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flagged_messages_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          }
        ];
      };
      offers: {
        Row: {
          accepted_at: string | null;
          checkout_session_id: string | null;
          created_at: string;
          id: number;
          made_public_at: string | null;
          payment_intent_id: string | null;
          property_id: number;
          request_id: number;
          total_price: number;
        };
        Insert: {
          accepted_at?: string | null;
          checkout_session_id?: string | null;
          created_at?: string;
          id?: number;
          made_public_at?: string | null;
          payment_intent_id?: string | null;
          property_id: number;
          request_id: number;
          total_price: number;
        };
        Update: {
          accepted_at?: string | null;
          checkout_session_id?: string | null;
          created_at?: string;
          id?: number;
          made_public_at?: string | null;
          payment_intent_id?: string | null;
          property_id?: number;
          request_id?: number;
          total_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "offers_property_id_properties_id_fk";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_request_id_requests_id_fk";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "requests";
            referencedColumns: ["id"];
          },
        ];
      };
      properties: {
        Row: {
          about: string;
          address: string | null;
          airbnb_message_url: string | null;
          airbnb_url: string | null;
          area_description: string | null;
          avg_rating: number;
          check_in_info: string | null;
          created_at: string;
          host_id: string | null;
          host_name: string | null;
          id: number;
          image_url: string[];
          map_screenshot: string | null;
          max_num_guests: number;
          name: string;
          num_bedrooms: number;
          num_beds: number;
          num_ratings: number;
          original_nightly_price: number;
          property_amenities: SupabaseDatabase["public"]["Enums"]["property_amenities"][];
          property_safety_items: SupabaseDatabase["public"]["Enums"]["property_safety_items"][];
          property_standout_amenities: SupabaseDatabase["public"]["Enums"]["property_standout_amenities"][];
          property_type: SupabaseDatabase["public"]["Enums"]["property_type"];
        };
        Insert: {
          about: string;
          address?: string | null;
          airbnb_message_url?: string | null;
          airbnb_url?: string | null;
          area_description?: string | null;
          avg_rating: number;
          check_in_info?: string | null;
          created_at?: string;
          host_id?: string | null;
          host_name?: string | null;
          id?: number;
          image_url: string[];
          map_screenshot?: string | null;
          max_num_guests: number;
          name: string;
          num_bedrooms: number;
          num_beds: number;
          num_ratings: number;
          original_nightly_price: number;
          property_amenities: SupabaseDatabase["public"]["Enums"]["property_amenities"][];
          property_safety_items: SupabaseDatabase["public"]["Enums"]["property_safety_items"][];
          property_standout_amenities: SupabaseDatabase["public"]["Enums"]["property_standout_amenities"][];
          property_type: SupabaseDatabase["public"]["Enums"]["property_type"];
        };
        Update: {
          about?: string;
          address?: string | null;
          airbnb_message_url?: string | null;
          airbnb_url?: string | null;
          area_description?: string | null;
          avg_rating?: number;
          check_in_info?: string | null;
          created_at?: string;
          host_id?: string | null;
          host_name?: string | null;
          id?: number;
          image_url?: string[];
          map_screenshot?: string | null;
          max_num_guests?: number;
          name?: string;
          num_bedrooms?: number;
          num_beds?: number;
          num_ratings?: number;
          original_nightly_price?: number;
          property_amenities?: SupabaseDatabase["public"]["Enums"]["property_amenities"][];
          property_safety_items?: SupabaseDatabase["public"]["Enums"]["property_safety_items"][];
          property_standout_amenities?: SupabaseDatabase["public"]["Enums"]["property_standout_amenities"][];
          property_type?: SupabaseDatabase["public"]["Enums"]["property_type"];
        };
        Relationships: [
          {
            foreignKeyName: "properties_host_id_user_id_fk";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      referral_codes: {
        Row: {
          created_at: string;
          num_bookings_using_code: number;
          num_sign_ups_using_code: number;
          owner_id: string;
          referral_code: string;
          total_booking_volume: number;
        };
        Insert: {
          created_at?: string;
          num_bookings_using_code?: number;
          num_sign_ups_using_code?: number;
          owner_id: string;
          referral_code: string;
          total_booking_volume?: number;
        };
        Update: {
          created_at?: string;
          num_bookings_using_code?: number;
          num_sign_ups_using_code?: number;
          owner_id?: string;
          referral_code?: string;
          total_booking_volume?: number;
        };
        Relationships: [
          {
            foreignKeyName: "referral_codes_owner_id_user_id_fk";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      referral_earnings: {
        Row: {
          cashback_earned: number;
          created_at: string;
          earning_status: SupabaseDatabase["public"]["Enums"]["earning_status"];
          id: number;
          offer_id: number;
          referee_id: string;
          referral_code: string;
        };
        Insert: {
          cashback_earned: number;
          created_at?: string;
          earning_status?: SupabaseDatabase["public"]["Enums"]["earning_status"];
          id?: number;
          offer_id: number;
          referee_id: string;
          referral_code: string;
        };
        Update: {
          cashback_earned?: number;
          created_at?: string;
          earning_status?: SupabaseDatabase["public"]["Enums"]["earning_status"];
          id?: number;
          offer_id?: number;
          referee_id?: string;
          referral_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "referral_earnings_offer_id_offers_id_fk";
            columns: ["offer_id"];
            isOneToOne: false;
            referencedRelation: "offers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referral_earnings_referee_id_user_id_fk";
            columns: ["referee_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referral_earnings_referral_code_referral_codes_referral_code_fk";
            columns: ["referral_code"];
            isOneToOne: false;
            referencedRelation: "referral_codes";
            referencedColumns: ["referral_code"];
          },
        ];
      };
      requests: {
        Row: {
          check_in: string;
          check_out: string;
          confirmation_sent_at: string;
          created_at: string;
          has_approved: boolean;
          have_sent_follow_up: boolean;
          id: number;
          location: string;
          max_total_price: number;
          min_num_bedrooms: number | null;
          min_num_beds: number | null;
          note: string | null;
          num_guests: number;
          property_type:
          | SupabaseDatabase["public"]["Enums"]["property_type"]
          | null;
          resolved_at: string | null;
          user_id: string;
        };
        Insert: {
          check_in: string;
          check_out: string;
          confirmation_sent_at?: string;
          created_at?: string;
          has_approved?: boolean;
          have_sent_follow_up?: boolean;
          id?: number;
          location: string;
          max_total_price: number;
          min_num_bedrooms?: number | null;
          min_num_beds?: number | null;
          note?: string | null;
          num_guests?: number;
          property_type?:
          | SupabaseDatabase["public"]["Enums"]["property_type"]
          | null;
          resolved_at?: string | null;
          user_id: string;
        };
        Update: {
          check_in?: string;
          check_out?: string;
          confirmation_sent_at?: string;
          created_at?: string;
          has_approved?: boolean;
          have_sent_follow_up?: boolean;
          id?: number;
          location?: string;
          max_total_price?: number;
          min_num_bedrooms?: number | null;
          min_num_beds?: number | null;
          note?: string | null;
          num_guests?: number;
          property_type?:
          | SupabaseDatabase["public"]["Enums"]["property_type"]
          | null;
          resolved_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "requests_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      session: {
        Row: {
          expires: string;
          sessionToken: string;
          userId: string;
        };
        Insert: {
          expires: string;
          sessionToken: string;
          userId: string;
        };
        Update: {
          expires?: string;
          sessionToken?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_userId_user_id_fk";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      user: {
        Row: {
          email: string;
          emailVerified: string | null;
          id: string;
          image: string | null;
          name: string | null;
          password: string | null;
          phone_number: string | null;
          referral_code_used: string | null;
          referral_tier: SupabaseDatabase["public"]["Enums"]["referral_tier"];
          role: SupabaseDatabase["public"]["Enums"]["role"];
          username: string | null;
        };
        Insert: {
          email: string;
          emailVerified?: string | null;
          id: string;
          image?: string | null;
          name?: string | null;
          password?: string | null;
          phone_number?: string | null;
          referral_code_used?: string | null;
          referral_tier?: SupabaseDatabase["public"]["Enums"]["referral_tier"];
          role?: SupabaseDatabase["public"]["Enums"]["role"];
          username?: string | null;
        };
        Update: {
          email?: string;
          emailVerified?: string | null;
          id?: string;
          image?: string | null;
          name?: string | null;
          password?: string | null;
          phone_number?: string | null;
          referral_code_used?: string | null;
          referral_tier?: SupabaseDatabase["public"]["Enums"]["referral_tier"];
          role?: SupabaseDatabase["public"]["Enums"]["role"];
          username?: string | null;
        };
        Relationships: [];
      };
      verificationToken: {
        Row: {
          expires: string;
          identifier: string;
          token: string;
        };
        Insert: {
          expires: string;
          identifier: string;
          token: string;
        };
        Update: {
          expires?: string;
          identifier?: string;
          token?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      earning_status: "pending" | "paid" | "cancelled";
      host_type: "airbnb" | "direct" | "vrbo" | "other";
      property_amenities:
      | "Wifi"
      | "TV"
      | "Kitchen"
      | "Washer"
      | "Free parking on premises"
      | "Paid parking on premises"
      | "Air conditioning"
      | "Dedicated workspace";
      property_safety_items:
      | "Smoke alarm"
      | "First aid kit"
      | "Fire extinguisher"
      | "Carbon monoxide alarm";
      property_standout_amenities:
      | "Pool"
      | "Hot tub"
      | "Patio"
      | "BBQ grill"
      | "Outdoor dining area"
      | "Fire pit"
      | "Pool table"
      | "Indoor fireplace"
      | "Piano"
      | "Exercise equipment"
      | "Lake access"
      | "Beach access"
      | "Ski-in/Ski-out"
      | "Outdoor shower";
      property_type:
      | "house"
      | "guesthouse"
      | "apartment"
      | "room"
      | "townhouse";
      referral_tier: "Partner" | "Ambassador";
      role: "guest" | "host" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (SupabaseDatabase["public"]["Tables"] &
    SupabaseDatabase["public"]["Views"])
  | { schema: keyof SupabaseDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof SupabaseDatabase;
  }
  ? keyof (SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"] &
    SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? (SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"] &
    SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (SupabaseDatabase["public"]["Tables"] &
    SupabaseDatabase["public"]["Views"])
  ? (SupabaseDatabase["public"]["Tables"] &
    SupabaseDatabase["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
  ? R
  : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof SupabaseDatabase["public"]["Tables"]
  | { schema: keyof SupabaseDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof SupabaseDatabase;
  }
  ? keyof SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof SupabaseDatabase["public"]["Tables"]
  ? SupabaseDatabase["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I;
  }
  ? I
  : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof SupabaseDatabase["public"]["Tables"]
  | { schema: keyof SupabaseDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof SupabaseDatabase;
  }
  ? keyof SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof SupabaseDatabase["public"]["Tables"]
  ? SupabaseDatabase["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U;
  }
  ? U
  : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof SupabaseDatabase["public"]["Enums"]
  | { schema: keyof SupabaseDatabase },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof SupabaseDatabase;
  }
  ? keyof SupabaseDatabase[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? SupabaseDatabase[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof SupabaseDatabase["public"]["Enums"]
  ? SupabaseDatabase["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
