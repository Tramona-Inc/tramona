DO $$ BEGIN
 CREATE TYPE "host_type" AS ENUM('airbnb', 'direct', 'vrbo', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_amenities" AS ENUM('Bathtub', 'Hair dryer', 'Hot water', 'Shampoo', 'Essentials', 'Bed linens', 'Dryer', 'Dryer in common space', 'Extra pillows and blankets', 'Hangers', 'Iron', 'Room-darkening shades', 'Safe', 'Towels provided', 'Washer', 'Washer in common space', 'Cable TV', 'Dvd player', 'Game console', 'Stereo system', 'TV', 'Baby bath', 'Baby monitor', 'Babysitter recommendations', 'Children’s books and toys', 'Changing table', 'Children’s dinnerware', 'Crib', 'Family/kid friendly', 'Fireplace guards', 'High chair', 'Outlet covers', 'Pack ’n Play/travel crib', 'Stair gates', 'Table corner guards', 'Window guards', 'Air conditioning', 'Heating', 'Indoor fireplace', 'Carbon monoxide detector', 'Emergency exit', 'Fire extinguisher', 'First aid kit', 'Smoke detector', 'Desk', 'Internet', 'Laptop friendly workspace', 'Pocket wifi', 'Wireless Internet', 'Coffee maker', 'Cookware', 'Dishes and silverware', 'Dishwasher', 'Kitchen', 'Kettle', 'Microwave', 'Oven', 'Refrigerator', 'Stove', 'Toaster', 'Beach', 'Beach Front', 'Beach View', 'Downtown', 'Golf course front', 'Golf view', 'Lake', 'Lake access', 'Lake Front', 'Mountain', 'Mountain view', 'Near Ocean', 'Ocean Front', 'Resort', 'River', 'Rural', 'Sea view', 'Ski In', 'Ski in/Ski out', 'Ski Out', 'Town', 'Village', 'Water View', 'Waterfront', 'Outdoor pool', 'Garden or backyard', 'Bicycles available', 'Patio or balcony', 'BBQ grill', 'Beach essentials', 'Elevator', 'Free parking on premises', 'Indoor pool', 'Hot tub', 'Gym', 'Swimming pool', 'Communal pool', 'Free parking on street', 'EV charger', 'Single level home', 'Private pool', 'Paid parking off premises', 'Breakfast', 'Long term stays allowed', 'Luggage dropoff allowed', 'High touch surfaces disinfected', 'Enhanced cleaning practices', 'Doorman', 'Cleaning Disinfection', 'Cleaning before checkout', 'Grab-rails for shower and toilet', 'Tub with shower bench', 'Wheelchair accessible', 'Wide clearance to bed', 'Wide clearance to shower and toilet', 'Wide hallway clearance', 'Accessible-height toilet', 'Accessible-height bed', 'Paid parking on premises', 'Outdoor dining area', 'Pool table', 'Piano', 'Exercise equipment', 'Fire pit', 'Outdoor shower', 'Private entrance', 'Pets Allowed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_room_type" AS ENUM('Entire place', 'Shared room', 'Private room');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_type" AS ENUM('Condominium', 'Apartment', 'Guesthouse', 'House', 'Loft', 'Boat', 'Camper/RV', 'Chalet', 'Bed & Breakfast', 'Villa', 'Tent', 'Cabin', 'Townhouse', 'Bungalow', 'Hut', 'Other');
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
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "host_profiles" (
	"user_id" text NOT NULL,
	"type" "host_type" DEFAULT 'other' NOT NULL,
	"profile_url" varchar(1000),
	"became_host_at" timestamp DEFAULT now() NOT NULL,
	"stripeAccountId" varchar,
	"charges_enabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversation_participants" (
	"conversation_id" varchar NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "conversation_participants_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
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
	"checkout_session_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"host_id" text,
	"name" varchar(255) NOT NULL,
	"host_name" varchar(255),
	"address" varchar(1000),
	"max_num_guests" smallint NOT NULL,
	"num_beds" smallint NOT NULL,
	"num_bedrooms" smallint NOT NULL,
	"num_bathrooms" smallint,
	"avg_rating" double precision DEFAULT 0 NOT NULL,
	"num_ratings" integer DEFAULT 0 NOT NULL,
	"airbnb_url" varchar,
	"airbnb_message_url" varchar,
	"image_url" varchar[] NOT NULL,
	"original_nightly_price" integer NOT NULL,
	"property_type" "property_type" NOT NULL,
	"room_type" "property_room_type" DEFAULT 'Entire place' NOT NULL,
	"amenities" property_amenities[] NOT NULL,
	"check_in_info" varchar,
	"check_in_time" time,
	"check_out_time" time,
	"about" text NOT NULL,
	"area_description" text,
	"map_screenshot" text,
	"created_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE IF NOT EXISTS "request_updated_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer,
	"preferences" varchar(255),
	"updated_price_usd_nightly" integer,
	"property_links" text
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
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
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_invites" (
	"group_id" integer NOT NULL,
	"invitee_email" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "group_invites_group_id_invitee_email_pk" PRIMARY KEY("group_id","invitee_email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_members" (
	"group_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "group_members_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conversationIndex" ON "messages" ("conversation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userIndex" ON "messages" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "made_public_at_index" ON "offers" ("made_public_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accepted_at_index" ON "offers" ("accepted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "phone_number_idx" ON "user" ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "user" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_profiles" ADD CONSTRAINT "host_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "properties" ADD CONSTRAINT "properties_host_id_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_groups" ADD CONSTRAINT "request_groups_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_updated_info" ADD CONSTRAINT "request_updated_info_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_made_by_group_id_groups_id_fk" FOREIGN KEY ("made_by_group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_request_group_id_request_groups_id_fk" FOREIGN KEY ("request_group_id") REFERENCES "request_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_referral_code_referral_codes_referral_code_fk" FOREIGN KEY ("referral_code") REFERENCES "referral_codes"("referral_code") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_referee_id_user_id_fk" FOREIGN KEY ("referee_id") REFERENCES "user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
