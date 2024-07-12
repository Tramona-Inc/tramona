export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SupabaseDatabase = {
  public: {
    Tables: {
      account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_userId_user_id_fk"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          accepted_at: string | null
          amount: number
          check_in: string
          check_out: string
          created_at: string
          dialog_shown: boolean
          id: number
          made_by_group_id: number
          num_guests: number
          payment_intent_id: string | null
          payment_method_id: string | null
          property_id: number
          setup_intent_id: string | null
          status: SupabaseDatabase["public"]["Enums"]["bid_status"]
          status_updated_at: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          amount: number
          check_in: string
          check_out: string
          created_at?: string
          dialog_shown?: boolean
          id?: number
          made_by_group_id: number
          num_guests?: number
          payment_intent_id?: string | null
          payment_method_id?: string | null
          property_id: number
          setup_intent_id?: string | null
          status?: SupabaseDatabase["public"]["Enums"]["bid_status"]
          status_updated_at?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          amount?: number
          check_in?: string
          check_out?: string
          created_at?: string
          dialog_shown?: boolean
          id?: number
          made_by_group_id?: number
          num_guests?: number
          payment_intent_id?: string | null
          payment_method_id?: string | null
          property_id?: number
          setup_intent_id?: string | null
          status?: SupabaseDatabase["public"]["Enums"]["bid_status"]
          status_updated_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_made_by_group_id_groups_id_fk"
            columns: ["made_by_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      booked_dates: {
        Row: {
          date: string
          property_id: number
        }
        Insert: {
          date: string
          property_id: number
        }
        Update: {
          date?: string
          property_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "booked_dates_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      bucket_list_destinations: {
        Row: {
          id: number
          location: string
          planned_check_in: string
          planned_check_out: string
          user_id: string
        }
        Insert: {
          id?: number
          location: string
          planned_check_in: string
          planned_check_out: string
          user_id: string
        }
        Update: {
          id?: number
          location?: string
          planned_check_in?: string
          planned_check_out?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bucket_list_destinations_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      bucket_list_properties: {
        Row: {
          id: number
          property_id: number
          user_id: string
        }
        Insert: {
          id?: number
          property_id: number
          user_id: string
        }
        Update: {
          id?: number
          property_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bucket_list_properties_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bucket_list_properties_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_guests: {
        Row: {
          admin_id: string
          conversation_id: string
          user_token: string
        }
        Insert: {
          admin_id: string
          conversation_id: string
          user_token: string
        }
        Update: {
          admin_id?: string
          conversation_id?: string
          user_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_guests_conversation_id_conversations_id_fk"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_conversations_id_fk"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string | null
          offer_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          offer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          offer_id?: string | null
        }
        Relationships: []
      }
      counters: {
        Row: {
          bid_id: number
          counter_amount: number
          created_at: string
          id: number
          property_id: number
          status: SupabaseDatabase["public"]["Enums"]["bid_status"]
          status_updated_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bid_id: number
          counter_amount: number
          created_at?: string
          id?: number
          property_id: number
          status?: SupabaseDatabase["public"]["Enums"]["bid_status"]
          status_updated_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bid_id?: number
          counter_amount?: number
          created_at?: string
          id?: number
          property_id?: number
          status?: SupabaseDatabase["public"]["Enums"]["bid_status"]
          status_updated_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "counters_bid_id_bids_id_fk"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counters_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counters_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invites: {
        Row: {
          expires_at: string
          group_id: number
          invitee_email: string
        }
        Insert: {
          expires_at: string
          group_id: number
          invitee_email: string
        }
        Update: {
          expires_at?: string
          group_id?: number
          invitee_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_invites_group_id_groups_id_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invites_link: {
        Row: {
          expires_at: string
          group_id: number
          id: string
        }
        Insert: {
          expires_at: string
          group_id: number
          id: string
        }
        Update: {
          expires_at?: string
          group_id?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_invites_link_group_id_groups_id_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: number
          user_id: string
        }
        Insert: {
          group_id: number
          user_id: string
        }
        Update: {
          group_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_groups_id_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          id: number
          owner_id: string
        }
        Insert: {
          id?: number
          owner_id: string
        }
        Update: {
          id?: number
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_user_id_fk"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_edit: boolean | null
          message: string
          read: boolean | null
          user_token: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id: string
          is_edit?: boolean | null
          message: string
          read?: boolean | null
          user_token?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_edit?: boolean | null
          message?: string
          read?: boolean | null
          user_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_messages_conversation_id_conversations_id_fk"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_messages_user_token_conversation_guests_user_token_fk"
            columns: ["user_token"]
            isOneToOne: false
            referencedRelation: "conversation_guests"
            referencedColumns: ["user_token"]
          },
        ]
      }
      host_profiles: {
        Row: {
          became_host_at: string
          charges_enabled: boolean | null
          cur_team_id: number
          hostaway_account_id: string | null
          hostaway_api_key: string | null
          hostaway_bearer_token: string | null
          stripeAccountId: string | null
          user_id: string
        }
        Insert: {
          became_host_at?: string
          charges_enabled?: boolean | null
          cur_team_id: number
          hostaway_account_id?: string | null
          hostaway_api_key?: string | null
          hostaway_bearer_token?: string | null
          stripeAccountId?: string | null
          user_id: string
        }
        Update: {
          became_host_at?: string
          charges_enabled?: boolean | null
          cur_team_id?: number
          hostaway_account_id?: string | null
          hostaway_api_key?: string | null
          hostaway_bearer_token?: string | null
          stripeAccountId?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_profiles_cur_team_id_host_teams_id_fk"
            columns: ["cur_team_id"]
            isOneToOne: false
            referencedRelation: "host_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "host_profiles_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      host_team_invites: {
        Row: {
          expires_at: string
          host_team_id: number
          invitee_email: string
        }
        Insert: {
          expires_at: string
          host_team_id: number
          invitee_email: string
        }
        Update: {
          expires_at?: string
          host_team_id?: number
          invitee_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_team_invites_host_team_id_host_teams_id_fk"
            columns: ["host_team_id"]
            isOneToOne: false
            referencedRelation: "host_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      host_team_members: {
        Row: {
          host_team_id: number
          user_id: string
        }
        Insert: {
          host_team_id: number
          user_id: string
        }
        Update: {
          host_team_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_team_members_host_team_id_host_teams_id_fk"
            columns: ["host_team_id"]
            isOneToOne: false
            referencedRelation: "host_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "host_team_members_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      host_teams: {
        Row: {
          id: number
          name: string | null
          owner_id: string
        }
        Insert: {
          id?: number
          name?: string | null
          owner_id: string
        }
        Update: {
          id?: number
          name?: string | null
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_teams_owner_id_user_id_fk"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_edit: boolean | null
          message: string
          read: boolean | null
          user_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id: string
          is_edit?: boolean | null
          message: string
          read?: boolean | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_edit?: boolean | null
          message?: string
          read?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_conversations_id_fk"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          accepted_at: string | null
          check_in: string
          check_out: string
          checkout_session_id: string | null
          created_at: string
          id: number
          made_public_at: string | null
          payment_intent_id: string | null
          property_id: number
          request_id: number | null
          total_price: number
          tramona_fee: number
        }
        Insert: {
          accepted_at?: string | null
          check_in: string
          check_out: string
          checkout_session_id?: string | null
          created_at?: string
          id?: number
          made_public_at?: string | null
          payment_intent_id?: string | null
          property_id: number
          request_id?: number | null
          total_price: number
          tramona_fee?: number
        }
        Update: {
          accepted_at?: string | null
          check_in?: string
          check_out?: string
          checkout_session_id?: string | null
          created_at?: string
          id?: number
          made_public_at?: string | null
          payment_intent_id?: string | null
          property_id?: number
          request_id?: number | null
          total_price?: number
          tramona_fee?: number
        }
        Relationships: [
          {
            foreignKeyName: "offers_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_request_id_requests_id_fk"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          about: string
          address: string
          airbnb_book_url: string | null
          airbnb_message_url: string | null
          airbnb_url: string | null
          amenities: string[]
          area_description: string | null
          avg_rating: number
          cancellation_policy: string | null
          check_in_info: string | null
          check_in_time: string | null
          check_out_time: string | null
          city: string
          created_at: string
          host_id: string | null
          host_image_url: string | null
          host_name: string | null
          host_profile_pic: string | null
          host_team_id: number | null
          hostaway_listing_id: number | null
          id: number
          image_url: string[]
          is_private: boolean
          latitude: number
          longitude: number
          map_screenshot: string | null
          max_num_guests: number
          name: string
          num_bathrooms: number | null
          num_bedrooms: number
          num_beds: number
          num_ratings: number
          original_nightly_price: number | null
          other_amenities: string[]
          other_house_rules: string | null
          pets_allowed: boolean | null
          pricing_screen_url: string | null
          property_status: SupabaseDatabase["public"]["Enums"]["property_status"] | null
          property_type: SupabaseDatabase["public"]["Enums"]["property_type"]
          room_type: SupabaseDatabase["public"]["Enums"]["property_room_type"]
          smoking_allowed: boolean | null
          url: string | null
        }
        Insert: {
          about: string
          address: string
          airbnb_book_url?: string | null
          airbnb_message_url?: string | null
          airbnb_url?: string | null
          amenities?: string[]
          area_description?: string | null
          avg_rating?: number
          cancellation_policy?: string | null
          check_in_info?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          city: string
          created_at?: string
          host_id?: string | null
          host_image_url?: string | null
          host_name?: string | null
          host_profile_pic?: string | null
          host_team_id?: number | null
          hostaway_listing_id?: number | null
          id?: number
          image_url: string[]
          is_private?: boolean
          latitude: number
          longitude: number
          map_screenshot?: string | null
          max_num_guests: number
          name: string
          num_bathrooms?: number | null
          num_bedrooms: number
          num_beds: number
          num_ratings?: number
          original_nightly_price?: number | null
          other_amenities?: string[]
          other_house_rules?: string | null
          pets_allowed?: boolean | null
          pricing_screen_url?: string | null
          property_status?:
            | SupabaseDatabase["public"]["Enums"]["property_status"]
            | null
          property_type: SupabaseDatabase["public"]["Enums"]["property_type"]
          room_type?: SupabaseDatabase["public"]["Enums"]["property_room_type"]
          smoking_allowed?: boolean | null
          url?: string | null
        }
        Update: {
          about?: string
          address?: string
          airbnb_book_url?: string | null
          airbnb_message_url?: string | null
          airbnb_url?: string | null
          amenities?: string[]
          area_description?: string | null
          avg_rating?: number
          cancellation_policy?: string | null
          check_in_info?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          city?: string
          created_at?: string
          host_id?: string | null
          host_image_url?: string | null
          host_name?: string | null
          host_profile_pic?: string | null
          host_team_id?: number | null
          hostaway_listing_id?: number | null
          id?: number
          image_url?: string[]
          is_private?: boolean
          latitude?: number
          longitude?: number
          map_screenshot?: string | null
          max_num_guests?: number
          name?: string
          num_bathrooms?: number | null
          num_bedrooms?: number
          num_beds?: number
          num_ratings?: number
          original_nightly_price?: number | null
          other_amenities?: string[]
          other_house_rules?: string | null
          pets_allowed?: boolean | null
          pricing_screen_url?: string | null
          property_status?:
            | SupabaseDatabase["public"]["Enums"]["property_status"]
            | null
          property_type?: SupabaseDatabase["public"]["Enums"]["property_type"]
          room_type?: SupabaseDatabase["public"]["Enums"]["property_room_type"]
          smoking_allowed?: boolean | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_host_id_user_id_fk"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          created_at: string
          num_bookings_using_code: number
          num_sign_ups_using_code: number
          owner_id: string
          referral_code: string
          total_booking_volume: number
        }
        Insert: {
          created_at?: string
          num_bookings_using_code?: number
          num_sign_ups_using_code?: number
          owner_id: string
          referral_code: string
          total_booking_volume?: number
        }
        Update: {
          created_at?: string
          num_bookings_using_code?: number
          num_sign_ups_using_code?: number
          owner_id?: string
          referral_code?: string
          total_booking_volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_owner_id_user_id_fk"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_earnings: {
        Row: {
          cashback_earned: number
          created_at: string
          earning_status: SupabaseDatabase["public"]["Enums"]["earning_status"]
          id: number
          offer_id: number
          referee_id: string
          referral_code: string
        }
        Insert: {
          cashback_earned: number
          created_at?: string
          earning_status?: SupabaseDatabase["public"]["Enums"]["earning_status"]
          id?: number
          offer_id: number
          referee_id: string
          referral_code: string
        }
        Update: {
          cashback_earned?: number
          created_at?: string
          earning_status?: SupabaseDatabase["public"]["Enums"]["earning_status"]
          id?: number
          offer_id?: number
          referee_id?: string
          referral_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_earnings_offer_id_offers_id_fk"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_earnings_referee_id_user_id_fk"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_earnings_referral_code_referral_codes_referral_code_fk"
            columns: ["referral_code"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["referral_code"]
          },
        ]
      }
      request_groups: {
        Row: {
          confirmation_sent_at: string
          created_by_user_id: string
          has_approved: boolean
          have_sent_follow_up: boolean
          id: number
        }
        Insert: {
          confirmation_sent_at?: string
          created_by_user_id: string
          has_approved?: boolean
          have_sent_follow_up?: boolean
          id?: number
        }
        Update: {
          confirmation_sent_at?: string
          created_by_user_id?: string
          has_approved?: boolean
          have_sent_follow_up?: boolean
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "request_groups_created_by_user_id_user_id_fk"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      request_updated_info: {
        Row: {
          id: number
          preferences: string | null
          property_links: string | null
          request_id: number | null
          updated_price_usd_nightly: number | null
        }
        Insert: {
          id?: number
          preferences?: string | null
          property_links?: string | null
          request_id?: number | null
          updated_price_usd_nightly?: number | null
        }
        Update: {
          id?: number
          preferences?: string | null
          property_links?: string | null
          request_id?: number | null
          updated_price_usd_nightly?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "request_updated_info_request_id_requests_id_fk"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          airbnb_link: string | null
          check_in: string
          check_out: string
          created_at: string
          id: number
          lat: number | null
          lng: number | null
          location: string
          made_by_group_id: number
          max_total_price: number
          min_num_bathrooms: number | null
          min_num_bedrooms: number | null
          min_num_beds: number | null
          note: string | null
          num_guests: number
          property_type: SupabaseDatabase["public"]["Enums"]["property_type"] | null
          radius: number | null
          request_group_id: number
          resolved_at: string | null
        }
        Insert: {
          airbnb_link?: string | null
          check_in: string
          check_out: string
          created_at?: string
          id?: number
          lat?: number | null
          lng?: number | null
          location: string
          made_by_group_id: number
          max_total_price: number
          min_num_bathrooms?: number | null
          min_num_bedrooms?: number | null
          min_num_beds?: number | null
          note?: string | null
          num_guests?: number
          property_type?: SupabaseDatabase["public"]["Enums"]["property_type"] | null
          radius?: number | null
          request_group_id: number
          resolved_at?: string | null
        }
        Update: {
          airbnb_link?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          id?: number
          lat?: number | null
          lng?: number | null
          location?: string
          made_by_group_id?: number
          max_total_price?: number
          min_num_bathrooms?: number | null
          min_num_bedrooms?: number | null
          min_num_beds?: number | null
          note?: string | null
          num_guests?: number
          property_type?: SupabaseDatabase["public"]["Enums"]["property_type"] | null
          radius?: number | null
          request_group_id?: number
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_made_by_group_id_groups_id_fk"
            columns: ["made_by_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_request_group_id_request_groups_id_fk"
            columns: ["request_group_id"]
            isOneToOne: false
            referencedRelation: "request_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      requests_to_properties: {
        Row: {
          property_id: number
          request_id: number
        }
        Insert: {
          property_id: number
          request_id: number
        }
        Update: {
          property_id?: number
          request_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "requests_to_properties_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_to_properties_request_id_requests_id_fk"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          check_in: string
          check_out: string
          echo_token: string
          id: number
          name_of_verified_user: string
          property_address: string
          property_country_iso: string
          property_id: number | null
          property_town: string
          superhog_reservation_id: string
          superhog_status: SupabaseDatabase["public"]["Enums"]["superhog_status"]
          superhog_verification_id: string
          user_id: number | null
        }
        Insert: {
          check_in: string
          check_out: string
          echo_token: string
          id?: number
          name_of_verified_user: string
          property_address: string
          property_country_iso: string
          property_id?: number | null
          property_town: string
          superhog_reservation_id: string
          superhog_status: SupabaseDatabase["public"]["Enums"]["superhog_status"]
          superhog_verification_id: string
          user_id?: number | null
        }
        Update: {
          check_in?: string
          check_out?: string
          echo_token?: string
          id?: number
          name_of_verified_user?: string
          property_address?: string
          property_country_iso?: string
          property_id?: number | null
          property_town?: string
          superhog_reservation_id?: string
          superhog_status?: SupabaseDatabase["public"]["Enums"]["superhog_status"]
          superhog_verification_id?: string
          user_id?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: number
          name: string
          profile_pic: string
          property_id: number
          rating: number
          review: string
        }
        Insert: {
          id?: number
          name: string
          profile_pic: string
          property_id: number
          rating: number
          review: string
        }
        Update: {
          id?: number
          name?: string
          profile_pic?: string
          property_id?: number
          rating?: number
          review?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      session: {
        Row: {
          expires: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_userId_user_id_fk"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          bid_id: number | null
          check_in: string
          check_out: string
          created_at: string
          group_id: number
          id: number
          num_guests: number
          offer_id: number | null
          property_id: number
        }
        Insert: {
          bid_id?: number | null
          check_in: string
          check_out: string
          created_at?: string
          group_id: number
          id?: number
          num_guests: number
          offer_id?: number | null
          property_id: number
        }
        Update: {
          bid_id?: number | null
          check_in?: string
          check_out?: string
          created_at?: string
          group_id?: number
          id?: number
          num_guests?: number
          offer_id?: number | null
          property_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trips_bid_id_bids_id_fk"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_group_id_groups_id_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_offer_id_offers_id_fk"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          about: string | null
          avatar: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emailVerified: string | null
          id: string
          image: string | null
          is_identity_verified: SupabaseDatabase["public"]["Enums"]["is_identity_verified"]
          is_whats_app: boolean
          last_text_at: string | null
          location: string | null
          name: string | null
          password: string | null
          phone_number: string | null
          profile_url: string | null
          referral_code_used: string | null
          referral_tier: SupabaseDatabase["public"]["Enums"]["referral_tier"]
          role: SupabaseDatabase["public"]["Enums"]["role"]
          setup_intent_id: string | null
          socials: string[] | null
          stripe_customer_id: string | null
          username: string | null
          verification_report_id: string | null
        }
        Insert: {
          about?: string | null
          avatar?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emailVerified?: string | null
          id: string
          image?: string | null
          is_identity_verified?: SupabaseDatabase["public"]["Enums"]["is_identity_verified"]
          is_whats_app?: boolean
          last_text_at?: string | null
          location?: string | null
          name?: string | null
          password?: string | null
          phone_number?: string | null
          profile_url?: string | null
          referral_code_used?: string | null
          referral_tier?: SupabaseDatabase["public"]["Enums"]["referral_tier"]
          role?: SupabaseDatabase["public"]["Enums"]["role"]
          setup_intent_id?: string | null
          socials?: string[] | null
          stripe_customer_id?: string | null
          username?: string | null
          verification_report_id?: string | null
        }
        Update: {
          about?: string | null
          avatar?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emailVerified?: string | null
          id?: string
          image?: string | null
          is_identity_verified?: SupabaseDatabase["public"]["Enums"]["is_identity_verified"]
          is_whats_app?: boolean
          last_text_at?: string | null
          location?: string | null
          name?: string | null
          password?: string | null
          phone_number?: string | null
          profile_url?: string | null
          referral_code_used?: string | null
          referral_tier?: SupabaseDatabase["public"]["Enums"]["referral_tier"]
          role?: SupabaseDatabase["public"]["Enums"]["role"]
          setup_intent_id?: string | null
          socials?: string[] | null
          stripe_customer_id?: string | null
          username?: string | null
          verification_report_id?: string | null
        }
        Relationships: []
      }
      verificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bid_status: "Pending" | "Accepted" | "Rejected" | "Cancelled"
      earning_status: "pending" | "paid" | "cancelled"
      host_type: "airbnb" | "direct" | "vrbo" | "other"
      is_identity_verified: "false" | "true" | "pending"
      property_amenities:
        | "Street Parking"
        | "Garage Parking"
        | "Ev charging"
        | "Driveway parking"
        | "Couch"
        | "Carbon monoxide detector"
        | "Emergency exit"
        | "Fire extinguisher"
        | "First aid kit"
        | "Smoke detector"
        | "Desk"
        | "Internet"
        | "Laptop friendly workspace"
        | "Pocket wifi"
        | "Wireless Internet"
        | "Coffee maker"
        | "Cookware"
        | "Dishes and silverware"
        | "Dishwasher"
        | "Kitchen"
        | "Kettle"
        | "Microwave"
        | "Oven"
        | "Freezer"
        | "Refrigerator"
        | "Stove"
        | "Toaster"
        | "Beach"
        | "Beach Front"
        | "Beach View"
        | "Downtown"
        | "Golf course front"
        | "Golf view"
        | "Lake"
        | "Lake access"
        | "Lake Front"
        | "Mountain"
        | "Mountain view"
        | "Near Ocean"
        | "Ocean Front"
        | "Resort"
        | "River"
        | "Rural"
        | "Sea view"
        | "Ski In"
        | "Ski in/Ski out"
        | "Ski Out"
        | "Town"
        | "Village"
        | "Water View"
        | "Waterfront"
        | "Outdoor pool"
        | "Garden or backyard"
        | "Bicycles available"
        | "Patio or balcony"
        | "BBQ grill"
        | "Beach essentials"
        | "Elevator"
        | "Free parking on premises"
        | "Indoor pool"
        | "Hot tub"
        | "Gym"
        | "Swimming pool"
        | "Communal pool"
        | "Free parking on street"
        | "EV charger"
        | "Single level home"
        | "Private pool"
        | "Paid parking off premises"
        | "Breakfast"
        | "Long term stays allowed"
        | "Luggage dropoff allowed"
        | "High touch surfaces disinfected"
        | "Enhanced cleaning practices"
        | "Doorman"
        | "Cleaning Disinfection"
        | "Cleaning before checkout"
        | "Grab-rails for shower and toilet"
        | "Tub with shower bench"
        | "Wheelchair accessible"
        | "Wide clearance to bed"
        | "Wide clearance to shower and toilet"
        | "Wide hallway clearance"
        | "Accessible-height toilet"
        | "Accessible-height bed"
        | "Paid parking on premises"
        | "Outdoor dining area"
        | "Pool table"
        | "Piano"
        | "Exercise equipment"
        | "Fire pit"
        | "Outdoor shower"
        | "Private entrance"
        | "Pets Allowed"
        | "Dishes & silverware"
        | "Dining table and chairs"
        | "TV"
      property_pms: "Hostaway"
      property_room_type:
        | "Entire place"
        | "Shared room"
        | "Private room"
        | "Other"
      property_safety_items:
        | "Smoke alarm"
        | "First aid kit"
        | "Fire extinguisher"
        | "Carbon monoxide alarm"
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
        | "Outdoor shower"
      property_status: "Listed" | "Drafted" | "Archived"
      property_type:
        | "Condominium"
        | "Apartment"
        | "Guesthouse"
        | "House"
        | "Loft"
        | "Boat"
        | "Camper/RV"
        | "Chalet"
        | "Bed & Breakfast"
        | "Villa"
        | "Tent"
        | "Cabin"
        | "Townhouse"
        | "Bungalow"
        | "Hut"
        | "Studio"
        | "Aparthotel"
        | "Hotel"
        | "Yurt"
        | "Treehouse"
        | "Cottage"
        | "Guest suite"
        | "Tiny house"
        | "Bed & breakfast"
        | "Camper/rv"
        | "Serviced apartment"
        | "Other"
        | "Home"
        | "Hotels"
        | "Alternative"
        | "house"
        | "Castle"
        | "Dorm"
        | "Guest Suite"
        | "Tiny House"
        | "Plane"
        | "Igloo"
        | "Lighthouse"
        | "Tipi"
        | "Cave"
        | "Island"
        | "Earth House"
        | "Train"
        | "Boutique hotel"
        | "Nature lodge"
        | "Hostel"
        | "Timeshare"
        | "Minsu (Taiwan)"
        | "Ryokan (Japan)"
        | "Pension (Korea)"
        | "Heritage hotel (India)"
        | "Barn"
        | "Campsite"
        | "Casa Particular (Cuba)"
        | "Cycladic House"
        | "Dammusi"
        | "Dome House"
        | "Farm Stay"
        | "Holiday Park"
        | "Houseboat"
        | "Kezhan"
        | "Ranch"
        | "Religious Building"
        | "Riad"
        | "Shipping Container"
        | "Tower"
        | "Trullo"
        | "Windmill"
        | "Shepherd’s Hut"
      referral_tier: "Partner" | "Ambassador"
      role: "guest" | "host" | "admin"
      superhog_status: "Approved" | "Flagged" | "Rejected" | "Pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = SupabaseDatabase[Extract<keyof SupabaseDatabase, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof SupabaseDatabase },
  TableName extends PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
    ? keyof (SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"] &
        SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? (SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"] &
      SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof SupabaseDatabase },
  TableName extends PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
    ? keyof SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof SupabaseDatabase },
  TableName extends PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
    ? keyof SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? SupabaseDatabase[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof SupabaseDatabase },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof SupabaseDatabase }
    ? keyof SupabaseDatabase[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof SupabaseDatabase }
  ? SupabaseDatabase[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
