-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_room_type" AS ENUM('Entire place', 'Shared room', 'Private room', 'Other', 'Flexible');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_amenities" AS ENUM('Street Parking', 'Garage Parking', 'Ev charging', 'Driveway parking', 'Wifi', 'TV', 'Kitchen', 'Washer', 'Free parking on premises', 'Paid parking on premises', 'Air conditioning', 'Dedicated workspace', 'Couch', 'Carbon monoxide detector', 'Emergency exit', 'Fire extinguisher', 'First aid kit', 'Smoke detector', 'Desk', 'Internet', 'Laptop friendly workspace', 'Pocket wifi', 'Wireless Internet', 'Coffee maker', 'Cookware', 'Dishes and silverware', 'Dishwasher', 'Kettle', 'Microwave', 'Oven', 'Freezer', 'Refrigerator', 'Stove', 'Toaster', 'Beach', 'Beach Front', 'Beach View', 'Downtown', 'Golf course front', 'Golf view', 'Lake', 'Lake access', 'Lake Front', 'Mountain', 'Mountain view', 'Near Ocean', 'Ocean Front', 'Resort', 'River', 'Rural', 'Sea view', 'Ski In', 'Ski in/Ski out', 'Ski Out', 'Town', 'Village', 'Water View', 'Waterfront', 'Outdoor pool', 'Garden or backyard', 'Bicycles available', 'Patio or balcony', 'BBQ grill', 'Beach essentials', 'Elevator', 'Indoor pool', 'Hot tub', 'Gym', 'Swimming pool', 'Communal pool', 'Free parking on street', 'EV charger', 'Single level home', 'Private pool', 'Paid parking off premises', 'Breakfast', 'Long term stays allowed', 'Luggage dropoff allowed', 'High touch surfaces disinfected', 'Enhanced cleaning practices', 'Doorman', 'Cleaning Disinfection', 'Cleaning before checkout', 'Grab-rails for shower and toilet', 'Tub with shower bench', 'Wheelchair accessible', 'Wide clearance to bed', 'Wide clearance to shower and toilet', 'Wide hallway clearance', 'Accessible-height toilet', 'Accessible-height bed', 'Outdoor dining area', 'Pool table', 'Piano', 'Exercise equipment', 'Fire pit', 'Outdoor shower', 'Private entrance', 'Pets Allowed', 'Dishes & silverware', 'Dining table and chairs', 'Bathtub', 'Hair dryer', 'Hot water', 'Shampoo', 'Essentials', 'Bed linens', 'Dryer', 'Dryer in common space', 'Extra pillows and blankets', 'Hangers', 'Iron', 'Room-darkening shades', 'Safe', 'Towels provided', 'Washer in common space', 'Cable TV', 'Dvd player', 'Game console', 'Stereo system', 'Baby bath', 'Baby monitor', 'Babysitter recommendations', 'Children’s books and toys', 'Changing table', 'Children’s dinnerware', 'Crib', 'Family/kid friendly', 'Fireplace guards', 'High chair', 'Outlet covers', 'Pack ’n Play/travel crib', 'Stair gates', 'Table corner guards', 'Window guards', 'Heating', 'Indoor fireplace');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "host_type" AS ENUM('airbnb', 'direct', 'vrbo', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_safety_items" AS ENUM('Smoke alarm', 'First aid kit', 'Fire extinguisher', 'Carbon monoxide alarm');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_standout_amenities" AS ENUM('Pool', 'Hot tub', 'Patio', 'BBQ grill', 'Outdoor dining area', 'Fire pit', 'Pool table', 'Indoor fireplace', 'Piano', 'Exercise equipment', 'Lake access', 'Beach access', 'Ski-in/Ski-out', 'Outdoor shower');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_type" AS ENUM('house', 'guesthouse', 'apartment', 'room', 'townhouse', 'Condominium', 'Apartment', 'Guesthouse', 'House', 'Loft', 'Boat', 'Camper/RV', 'Chalet', 'Bed & Breakfast', 'Villa', 'Tent', 'Cabin', 'Townhouse', 'Bungalow', 'Hut', 'Other', 'Home', 'Hotels', 'Alternative', 'Studio', 'Aparthotel', 'Hotel', 'Yurt', 'Treehouse', 'Cottage', 'Guest suite', 'Tiny house', 'Bed & breakfast', 'Camper/rv', 'Serviced apartment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "earning_status" AS ENUM('pending', 'paid', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "referral_tier" AS ENUM('Partner', 'Ambassador');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('guest', 'host', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "is_identity_verified" AS ENUM('false', 'true', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "bid_status" AS ENUM('Pending', 'Accepted', 'Rejected', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "superhog_status" AS ENUM('Approved', 'Flagged', 'Rejected', 'Pending', 'null');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "host_profiles" (
	"user_id" text NOT NULL,
	"type" "host_type" DEFAULT 'other' NOT NULL,
	"profile_url" varchar(1000),
	"became_host_at" timestamp DEFAULT now() NOT NULL,
	"stripeAccountId" varchar,
	"charges_enabled" boolean DEFAULT false,
	"cur_team_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"offer_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"conversation_id" varchar NOT NULL,
	"user_id" text,
	"message" varchar(1500) NOT NULL,
	"read" boolean DEFAULT false,
	"is_edit" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"total_price" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"made_public_at" timestamp,
	"accepted_at" timestamp,
	"payment_intent_id" varchar,
	"checkout_session_id" varchar,
	"tramona_fee" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "request_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_by_user_id" text NOT NULL,
	"has_approved" boolean DEFAULT false NOT NULL,
	"confirmation_sent_at" timestamp DEFAULT now() NOT NULL,
	"have_sent_follow_up" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_codes" (
	"referral_code" varchar(7) PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"total_booking_volume" integer DEFAULT 0 NOT NULL,
	"num_sign_ups_using_code" integer DEFAULT 0 NOT NULL,
	"num_bookings_using_code" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_earnings" (
	"id" serial PRIMARY KEY NOT NULL,
	"referral_code" text NOT NULL,
	"referee_id" text NOT NULL,
	"offer_id" integer NOT NULL,
	"earning_status" "earning_status" DEFAULT 'pending' NOT NULL,
	"cashback_earned" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" varchar(510),
	"username" varchar(60),
	"referral_code_used" varchar(7),
	"role" "role" DEFAULT 'guest' NOT NULL,
	"referral_tier" "referral_tier" DEFAULT 'Partner' NOT NULL,
	"phone_number" varchar(20),
	"last_text_at" timestamp DEFAULT now(),
	"is_whats_app" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"stripe_customer_id" varchar,
	"is_identity_verified" "is_identity_verified" DEFAULT 'false' NOT NULL,
	"verification_report_id" varchar,
	"date_of_birth" varchar,
	"setup_intent_id" varchar,
	"profile_url" varchar(1000),
	"location" varchar(1000),
	"socials" varchar[] DEFAULT '{}',
	"about" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bucket_list_destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"location" varchar NOT NULL,
	"planned_check_in" date NOT NULL,
	"planned_check_out" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bucket_list_properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"property_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "counters" (
	"id" serial PRIMARY KEY NOT NULL,
	"bid_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"counter_amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status" "bid_status" DEFAULT 'Pending' NOT NULL,
	"status_updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "request_updated_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer,
	"preferences" varchar(255),
	"updated_price_usd_nightly" integer,
	"property_links" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"echo_token" varchar(100) NOT NULL,
	"property_id" integer,
	"user_id" integer,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"property_address" varchar(100) NOT NULL,
	"property_town" varchar(100) NOT NULL,
	"property_country_iso" varchar(4) NOT NULL,
	"superhog_verification_id" varchar(100) NOT NULL,
	"superhog_reservation_id" varchar(100) NOT NULL,
	"superhog_status" "superhog_status" DEFAULT 'null',
	"name_of_verified_user" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"made_by_group_id" integer NOT NULL,
	"request_group_id" integer NOT NULL,
	"max_total_price" integer NOT NULL,
	"location" varchar(255) NOT NULL,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"num_guests" smallint DEFAULT 1 NOT NULL,
	"min_num_beds" smallint DEFAULT 1,
	"min_num_bedrooms" smallint DEFAULT 1,
	"property_type" "property_type",
	"note" varchar(255),
	"airbnb_link" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"min_num_bathrooms" smallint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"made_by_group_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"num_guests" integer DEFAULT 1 NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"accepted_at" timestamp,
	"setup_intent_id" varchar,
	"payment_method_id" varchar,
	"status" "bid_status" DEFAULT 'Pending' NOT NULL,
	"status_updated_at" timestamp DEFAULT now() NOT NULL,
	"payment_intent_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "host_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"owner_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"host_id" text,
	"host_team_id" integer,
	"property_type" "property_type" NOT NULL,
	"room_type" "property_room_type" DEFAULT 'Entire place' NOT NULL,
	"max_num_guests" smallint NOT NULL,
	"num_beds" smallint NOT NULL,
	"num_bedrooms" smallint NOT NULL,
	"num_bathrooms" double precision,
	"host_name" varchar(255),
	"address" varchar(1000) NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"url" varchar,
	"check_in_info" varchar,
	"check_in_time" time,
	"check_out_time" time,
	"amenities" varchar[],
	"other_amenities" varchar[] DEFAULT '{}' NOT NULL,
	"image_url" varchar[] NOT NULL,
	"name" varchar(255) NOT NULL,
	"about" text NOT NULL,
	"pets_allowed" boolean,
	"smoking_allowed" boolean,
	"other_house_rules" varchar(1000),
	"avg_rating" double precision DEFAULT 0 NOT NULL,
	"num_ratings" integer DEFAULT 0 NOT NULL,
	"airbnb_url" varchar,
	"airbnb_message_url" varchar,
	"original_nightly_price" integer,
	"area_description" text,
	"map_screenshot" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"cancellation_policy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversation_participants" (
	"conversation_id" varchar NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "conversation_participants_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_members" (
	"group_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "group_members_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booked_dates" (
	"property_id" integer NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "booked_dates_date_property_id_pk" PRIMARY KEY("property_id","date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "requests_to_properties" (
	"request_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	CONSTRAINT "requests_to_properties_request_id_property_id_pk" PRIMARY KEY("request_id","property_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "host_team_members" (
	"host_team_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "host_team_members_host_team_id_user_id_pk" PRIMARY KEY("host_team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_invites" (
	"group_id" integer NOT NULL,
	"invitee_email" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "group_invites_group_id_invitee_email_pk" PRIMARY KEY("group_id","invitee_email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "host_team_invites" (
	"host_team_id" integer NOT NULL,
	"invitee_email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "host_team_invites_host_team_id_invitee_email_pk" PRIMARY KEY("host_team_id","invitee_email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_index" ON "session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "host_profiles_user_id_index" ON "host_profiles" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "host_profiles_cur_team_id_index" ON "host_profiles" ("cur_team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_conversation_id_index" ON "messages" ("conversation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_user_id_index" ON "messages" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offers_made_public_at_index" ON "offers" ("made_public_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offers_accepted_at_index" ON "offers" ("accepted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offers_request_id_index" ON "offers" ("request_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "offers_property_id_index" ON "offers" ("property_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "request_groups_created_by_user_id_index" ON "request_groups" ("created_by_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "owner_id_idx" ON "referral_codes" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referral_earnings_referral_code_index" ON "referral_earnings" ("referral_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referral_earnings_referee_id_index" ON "referral_earnings" ("referee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referral_earnings_offer_id_index" ON "referral_earnings" ("offer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_phone_number_index" ON "user" ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_index" ON "user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "counters_bid_id_index" ON "counters" ("bid_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "counters_property_id_index" ON "counters" ("property_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "request_updated_info_request_id_index" ON "request_updated_info" ("request_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "requests_made_by_group_id_index" ON "requests" ("made_by_group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "requests_request_group_id_index" ON "requests" ("request_group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bids_made_by_group_id_index" ON "bids" ("made_by_group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bids_property_id_index" ON "bids" ("property_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "host_teams_owner_id_index" ON "host_teams" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booked_dates_property_id_index" ON "booked_dates" ("property_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "host_team_invites_host_team_id_index" ON "host_team_invites" ("host_team_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_profiles" ADD CONSTRAINT "host_profiles_cur_team_id_host_teams_id_fk" FOREIGN KEY ("cur_team_id") REFERENCES "public"."host_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_profiles" ADD CONSTRAINT "host_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_groups" ADD CONSTRAINT "request_groups_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_referee_id_user_id_fk" FOREIGN KEY ("referee_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_referral_code_referral_codes_referral_code_fk" FOREIGN KEY ("referral_code") REFERENCES "public"."referral_codes"("referral_code") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bucket_list_destinations" ADD CONSTRAINT "bucket_list_destinations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bucket_list_properties" ADD CONSTRAINT "bucket_list_properties_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bucket_list_properties" ADD CONSTRAINT "bucket_list_properties_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "counters" ADD CONSTRAINT "counters_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "counters" ADD CONSTRAINT "counters_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "counters" ADD CONSTRAINT "counters_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_updated_info" ADD CONSTRAINT "request_updated_info_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_made_by_group_id_groups_id_fk" FOREIGN KEY ("made_by_group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_request_group_id_request_groups_id_fk" FOREIGN KEY ("request_group_id") REFERENCES "public"."request_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bids" ADD CONSTRAINT "bids_made_by_group_id_groups_id_fk" FOREIGN KEY ("made_by_group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bids" ADD CONSTRAINT "bids_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_teams" ADD CONSTRAINT "host_teams_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "properties" ADD CONSTRAINT "properties_host_id_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booked_dates" ADD CONSTRAINT "booked_dates_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests_to_properties" ADD CONSTRAINT "requests_to_properties_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests_to_properties" ADD CONSTRAINT "requests_to_properties_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_team_members" ADD CONSTRAINT "host_team_members_host_team_id_host_teams_id_fk" FOREIGN KEY ("host_team_id") REFERENCES "public"."host_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_team_members" ADD CONSTRAINT "host_team_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_team_invites" ADD CONSTRAINT "host_team_invites_host_team_id_host_teams_id_fk" FOREIGN KEY ("host_team_id") REFERENCES "public"."host_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/