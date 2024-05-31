import { pgTable, index, foreignKey, pgEnum, text, timestamp, varchar, boolean, integer, serial, date, smallint, doublePrecision, time, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const propertyRoomType = pgEnum("property_room_type", ['Entire place', 'Shared room', 'Private room', 'Other', 'Flexible'])
export const propertyAmenities = pgEnum("property_amenities", ['Street Parking', 'Garage Parking', 'Ev charging', 'Driveway parking', 'Wifi', 'TV', 'Kitchen', 'Washer', 'Free parking on premises', 'Paid parking on premises', 'Air conditioning', 'Dedicated workspace', 'Couch', 'Carbon monoxide detector', 'Emergency exit', 'Fire extinguisher', 'First aid kit', 'Smoke detector', 'Desk', 'Internet', 'Laptop friendly workspace', 'Pocket wifi', 'Wireless Internet', 'Coffee maker', 'Cookware', 'Dishes and silverware', 'Dishwasher', 'Kettle', 'Microwave', 'Oven', 'Freezer', 'Refrigerator', 'Stove', 'Toaster', 'Beach', 'Beach Front', 'Beach View', 'Downtown', 'Golf course front', 'Golf view', 'Lake', 'Lake access', 'Lake Front', 'Mountain', 'Mountain view', 'Near Ocean', 'Ocean Front', 'Resort', 'River', 'Rural', 'Sea view', 'Ski In', 'Ski in/Ski out', 'Ski Out', 'Town', 'Village', 'Water View', 'Waterfront', 'Outdoor pool', 'Garden or backyard', 'Bicycles available', 'Patio or balcony', 'BBQ grill', 'Beach essentials', 'Elevator', 'Indoor pool', 'Hot tub', 'Gym', 'Swimming pool', 'Communal pool', 'Free parking on street', 'EV charger', 'Single level home', 'Private pool', 'Paid parking off premises', 'Breakfast', 'Long term stays allowed', 'Luggage dropoff allowed', 'High touch surfaces disinfected', 'Enhanced cleaning practices', 'Doorman', 'Cleaning Disinfection', 'Cleaning before checkout', 'Grab-rails for shower and toilet', 'Tub with shower bench', 'Wheelchair accessible', 'Wide clearance to bed', 'Wide clearance to shower and toilet', 'Wide hallway clearance', 'Accessible-height toilet', 'Accessible-height bed', 'Outdoor dining area', 'Pool table', 'Piano', 'Exercise equipment', 'Fire pit', 'Outdoor shower', 'Private entrance', 'Pets Allowed', 'Dishes & silverware', 'Dining table and chairs', 'Bathtub', 'Hair dryer', 'Hot water', 'Shampoo', 'Essentials', 'Bed linens', 'Dryer', 'Dryer in common space', 'Extra pillows and blankets', 'Hangers', 'Iron', 'Room-darkening shades', 'Safe', 'Towels provided', 'Washer in common space', 'Cable TV', 'Dvd player', 'Game console', 'Stereo system', 'Baby bath', 'Baby monitor', 'Babysitter recommendations', 'Children’s books and toys', 'Changing table', 'Children’s dinnerware', 'Crib', 'Family/kid friendly', 'Fireplace guards', 'High chair', 'Outlet covers', 'Pack ’n Play/travel crib', 'Stair gates', 'Table corner guards', 'Window guards', 'Heating', 'Indoor fireplace'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const hostType = pgEnum("host_type", ['airbnb', 'direct', 'vrbo', 'other'])
export const propertySafetyItems = pgEnum("property_safety_items", ['Smoke alarm', 'First aid kit', 'Fire extinguisher', 'Carbon monoxide alarm'])
export const propertyStandoutAmenities = pgEnum("property_standout_amenities", ['Pool', 'Hot tub', 'Patio', 'BBQ grill', 'Outdoor dining area', 'Fire pit', 'Pool table', 'Indoor fireplace', 'Piano', 'Exercise equipment', 'Lake access', 'Beach access', 'Ski-in/Ski-out', 'Outdoor shower'])
export const propertyType = pgEnum("property_type", ['house', 'guesthouse', 'apartment', 'room', 'townhouse', 'Condominium', 'Apartment', 'Guesthouse', 'House', 'Loft', 'Boat', 'Camper/RV', 'Chalet', 'Bed & Breakfast', 'Villa', 'Tent', 'Cabin', 'Townhouse', 'Bungalow', 'Hut', 'Other', 'Home', 'Hotels', 'Alternative', 'Studio', 'Aparthotel', 'Hotel', 'Yurt', 'Treehouse', 'Cottage', 'Guest suite', 'Tiny house', 'Bed & breakfast', 'Camper/rv', 'Serviced apartment'])
export const earningStatus = pgEnum("earning_status", ['pending', 'paid', 'cancelled'])
export const referralTier = pgEnum("referral_tier", ['Partner', 'Ambassador'])
export const role = pgEnum("role", ['guest', 'host', 'admin'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const isIdentityVerified = pgEnum("is_identity_verified", ['false', 'true', 'pending'])
export const bidStatus = pgEnum("bid_status", ['Pending', 'Accepted', 'Rejected', 'Cancelled'])
export const superhogStatus = pgEnum("superhog_status", ['Approved', 'Flagged', 'Rejected', 'Pending', 'null'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])


export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		userIdIdx: index().on(table.userId),
	}
});

export const hostProfiles = pgTable("host_profiles", {
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	type: hostType("type").default('other').notNull(),
	profileUrl: varchar("profile_url", { length: 1000 }),
	becameHostAt: timestamp("became_host_at", { mode: 'string' }).defaultNow().notNull(),
	stripeAccountId: varchar("stripeAccountId"),
	chargesEnabled: boolean("charges_enabled").default(false),
	curTeamId: integer("cur_team_id").notNull().references(() => hostTeams.id),
},
(table) => {
	return {
		userIdIdx: index().on(table.userId),
		curTeamIdIdx: index().on(table.curTeamId),
	}
});

export const conversations = pgTable("conversations", {
	id: varchar("id", { length: 21 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	offerId: varchar("offer_id"),
});

export const messages = pgTable("messages", {
	id: varchar("id", { length: 21 }).primaryKey().notNull(),
	conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" } ),
	message: varchar("message", { length: 1500 }).notNull(),
	read: boolean("read").default(false),
	isEdit: boolean("is_edit").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		conversationIdIdx: index().on(table.conversationId),
		userIdIdx: index().on(table.userId),
	}
});

export const offers = pgTable("offers", {
	id: serial("id").primaryKey().notNull(),
	requestId: integer("request_id").notNull().references(() => requests.id, { onDelete: "cascade" } ),
	propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" } ),
	totalPrice: integer("total_price").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	madePublicAt: timestamp("made_public_at", { mode: 'string' }),
	acceptedAt: timestamp("accepted_at", { mode: 'string' }),
	paymentIntentId: varchar("payment_intent_id"),
	checkoutSessionId: varchar("checkout_session_id"),
	tramonaFee: integer("tramona_fee").default(0).notNull(),
},
(table) => {
	return {
		madePublicAtIdx: index().on(table.madePublicAt),
		acceptedAtIdx: index().on(table.acceptedAt),
		requestIdIdx: index().on(table.requestId),
		propertyIdIdx: index().on(table.propertyId),
	}
});

export const requestGroups = pgTable("request_groups", {
	id: serial("id").primaryKey().notNull(),
	createdByUserId: text("created_by_user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	hasApproved: boolean("has_approved").default(false).notNull(),
	confirmationSentAt: timestamp("confirmation_sent_at", { mode: 'string' }).defaultNow().notNull(),
	haveSentFollowUp: boolean("have_sent_follow_up").default(false).notNull(),
},
(table) => {
	return {
		createdByUserIdIdx: index().on(table.createdByUserId),
	}
});

export const referralCodes = pgTable("referral_codes", {
	referralCode: varchar("referral_code", { length: 7 }).primaryKey().notNull(),
	ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	totalBookingVolume: integer("total_booking_volume").default(0).notNull(),
	numSignUpsUsingCode: integer("num_sign_ups_using_code").default(0).notNull(),
	numBookingsUsingCode: integer("num_bookings_using_code").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		ownerIdIdx: index("owner_id_idx").on(table.ownerId),
	}
});

export const referralEarnings = pgTable("referral_earnings", {
	id: serial("id").primaryKey().notNull(),
	referralCode: text("referral_code").notNull().references(() => referralCodes.referralCode, { onDelete: "set null" } ),
	refereeId: text("referee_id").notNull().references(() => user.id, { onDelete: "set null" } ),
	offerId: integer("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" } ),
	earningStatus: earningStatus("earning_status").default('pending').notNull(),
	cashbackEarned: integer("cashback_earned").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		referralCodeIdx: index().on(table.referralCode),
		refereeIdIdx: index().on(table.refereeId),
		offerIdIdx: index().on(table.offerId),
	}
});

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	password: varchar("password", { length: 510 }),
	username: varchar("username", { length: 60 }),
	referralCodeUsed: varchar("referral_code_used", { length: 7 }),
	role: role("role").default('guest').notNull(),
	referralTier: referralTier("referral_tier").default('Partner').notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }),
	lastTextAt: timestamp("last_text_at", { mode: 'string' }).defaultNow(),
	isWhatsApp: boolean("is_whats_app").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	stripeCustomerId: varchar("stripe_customer_id"),
	isIdentityVerified: isIdentityVerified("is_identity_verified").default('false').notNull(),
	verificationReportId: varchar("verification_report_id"),
	dateOfBirth: varchar("date_of_birth"),
	setupIntentId: varchar("setup_intent_id"),
	profileUrl: varchar("profile_url", { length: 1000 }),
	location: varchar("location", { length: 1000 }),
	socials: varchar("socials", { length:  }).default('{}').array(),
	about: text("about"),
},
(table) => {
	return {
		phoneNumberIdx: index().on(table.phoneNumber),
		emailIdx: index().on(table.email),
	}
});

export const groups = pgTable("groups", {
	id: serial("id").primaryKey().notNull(),
	ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
});

export const bucketListDestinations = pgTable("bucket_list_destinations", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	location: varchar("location").notNull(),
	plannedCheckIn: date("planned_check_in").notNull(),
	plannedCheckOut: date("planned_check_out").notNull(),
});

export const bucketListProperties = pgTable("bucket_list_properties", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" } ),
});

export const counters = pgTable("counters", {
	id: serial("id").primaryKey().notNull(),
	bidId: integer("bid_id").notNull().references(() => bids.id, { onDelete: "cascade" } ),
	propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" } ),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	counterAmount: integer("counter_amount").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	status: bidStatus("status").default('Pending').notNull(),
	statusUpdatedAt: timestamp("status_updated_at", { mode: 'string' }),
},
(table) => {
	return {
		bidIdIdx: index().on(table.bidId),
		propertyIdIdx: index().on(table.propertyId),
	}
});

export const requestUpdatedInfo = pgTable("request_updated_info", {
	id: serial("id").primaryKey().notNull(),
	requestId: integer("request_id").references(() => requests.id, { onDelete: "cascade" } ),
	preferences: varchar("preferences", { length: 255 }),
	updatedPriceUsdNightly: integer("updated_price_usd_nightly"),
	propertyLinks: text("property_links"),
},
(table) => {
	return {
		requestIdIdx: index().on(table.requestId),
	}
});

export const reservations = pgTable("reservations", {
	id: serial("id").primaryKey().notNull(),
	echoToken: varchar("echo_token", { length: 100 }).notNull(),
	propertyId: integer("property_id"),
	userId: integer("user_id"),
	checkIn: date("check_in").notNull(),
	checkOut: date("check_out").notNull(),
	propertyAddress: varchar("property_address", { length: 100 }).notNull(),
	propertyTown: varchar("property_town", { length: 100 }).notNull(),
	propertyCountryIso: varchar("property_country_iso", { length: 4 }).notNull(),
	superhogVerificationId: varchar("superhog_verification_id", { length: 100 }).notNull(),
	superhogReservationId: varchar("superhog_reservation_id", { length: 100 }).notNull(),
	superhogStatus: superhogStatus("superhog_status").default('null'),
	nameOfVerifiedUser: varchar("name_of_verified_user", { length: 100 }).notNull(),
});

export const requests = pgTable("requests", {
	id: serial("id").primaryKey().notNull(),
	madeByGroupId: integer("made_by_group_id").notNull().references(() => groups.id, { onDelete: "cascade" } ),
	requestGroupId: integer("request_group_id").notNull().references(() => requestGroups.id, { onDelete: "cascade" } ),
	maxTotalPrice: integer("max_total_price").notNull(),
	location: varchar("location", { length: 255 }).notNull(),
	checkIn: date("check_in").notNull(),
	checkOut: date("check_out").notNull(),
	numGuests: smallint("num_guests").default(1).notNull(),
	minNumBeds: smallint("min_num_beds").default(1),
	minNumBedrooms: smallint("min_num_bedrooms").default(1),
	propertyType: propertyType("property_type"),
	note: varchar("note", { length: 255 }),
	airbnbLink: varchar("airbnb_link", { length: 512 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at", { mode: 'string' }),
	minNumBathrooms: smallint("min_num_bathrooms").default(1),
},
(table) => {
	return {
		madeByGroupIdIdx: index().on(table.madeByGroupId),
		requestGroupIdIdx: index().on(table.requestGroupId),
	}
});

export const bids = pgTable("bids", {
	id: serial("id").primaryKey().notNull(),
	madeByGroupId: integer("made_by_group_id").notNull().references(() => groups.id, { onDelete: "cascade" } ),
	propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" } ),
	numGuests: integer("num_guests").default(1).notNull(),
	amount: integer("amount").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	checkIn: date("check_in").notNull(),
	checkOut: date("check_out").notNull(),
	acceptedAt: timestamp("accepted_at", { mode: 'string' }),
	setupIntentId: varchar("setup_intent_id"),
	paymentMethodId: varchar("payment_method_id"),
	status: bidStatus("status").default('Pending').notNull(),
	statusUpdatedAt: timestamp("status_updated_at", { mode: 'string' }).defaultNow().notNull(),
	paymentIntentId: varchar("payment_intent_id"),
},
(table) => {
	return {
		madeByGroupIdIdx: index().on(table.madeByGroupId),
		propertyIdIdx: index().on(table.propertyId),
	}
});

export const hostTeams = pgTable("host_teams", {
	id: serial("id").primaryKey().notNull(),
	name: text("name"),
	ownerId: text("owner_id").notNull().references(() => user.id),
},
(table) => {
	return {
		ownerIdIdx: index().on(table.ownerId),
	}
});

export const properties = pgTable("properties", {
	id: serial("id").primaryKey().notNull(),
	hostId: text("host_id").references(() => user.id, { onDelete: "cascade" } ),
	hostTeamId: integer("host_team_id"),
	propertyType: propertyType("property_type").notNull(),
	roomType: propertyRoomType("room_type").default('Entire place').notNull(),
	maxNumGuests: smallint("max_num_guests").notNull(),
	numBeds: smallint("num_beds").notNull(),
	numBedrooms: smallint("num_bedrooms").notNull(),
	numBathrooms: doublePrecision("num_bathrooms"),
	hostName: varchar("host_name", { length: 255 }),
	address: varchar("address", { length: 1000 }).notNull(),
	latitude: doublePrecision("latitude"),
	longitude: doublePrecision("longitude"),
	url: varchar("url"),
	checkInInfo: varchar("check_in_info"),
	checkInTime: time("check_in_time"),
	checkOutTime: time("check_out_time"),
	amenities: varchar("amenities", { length:  }).array(),
	otherAmenities: varchar("other_amenities", { length:  }).default('{}').array().notNull(),
	imageUrl: varchar("image_url", { length:  }).array().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	about: text("about").notNull(),
	petsAllowed: boolean("pets_allowed"),
	smokingAllowed: boolean("smoking_allowed"),
	otherHouseRules: varchar("other_house_rules", { length: 1000 }),
	avgRating: doublePrecision("avg_rating").notNull(),
	numRatings: integer("num_ratings").default(0).notNull(),
	airbnbUrl: varchar("airbnb_url"),
	airbnbMessageUrl: varchar("airbnb_message_url"),
	originalNightlyPrice: integer("original_nightly_price"),
	areaDescription: text("area_description"),
	mapScreenshot: text("map_screenshot"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	isPrivate: boolean("is_private").default(false).notNull(),
	cancellationPolicy: text("cancellation_policy"),
});

export const conversationParticipants = pgTable("conversation_participants", {
	conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		conversationParticipantsConversationIdUserIdPk: primaryKey({ columns: [table.conversationId, table.userId], name: "conversation_participants_conversation_id_user_id_pk"})
	}
});

export const groupMembers = pgTable("group_members", {
	groupId: integer("group_id").notNull().references(() => groups.id),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		groupMembersGroupIdUserIdPk: primaryKey({ columns: [table.groupId, table.userId], name: "group_members_group_id_user_id_pk"})
	}
});

export const bookedDates = pgTable("booked_dates", {
	propertyId: integer("property_id").notNull().references(() => properties.id),
	date: date("date").notNull(),
},
(table) => {
	return {
		propertyIdIdx: index().on(table.propertyId),
		bookedDatesDatePropertyIdPk: primaryKey({ columns: [table.propertyId, table.date], name: "booked_dates_date_property_id_pk"})
	}
});

export const requestsToProperties = pgTable("requests_to_properties", {
	requestId: integer("request_id").notNull().references(() => requests.id, { onDelete: "cascade" } ),
	propertyId: integer("property_id").notNull().references(() => properties.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		requestsToPropertiesRequestIdPropertyIdPk: primaryKey({ columns: [table.requestId, table.propertyId], name: "requests_to_properties_request_id_property_id_pk"})
	}
});

export const hostTeamMembers = pgTable("host_team_members", {
	hostTeamId: integer("host_team_id").notNull().references(() => hostTeams.id, { onDelete: "cascade" } ),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		hostTeamMembersHostTeamIdUserIdPk: primaryKey({ columns: [table.hostTeamId, table.userId], name: "host_team_members_host_team_id_user_id_pk"})
	}
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"})
	}
});

export const groupInvites = pgTable("group_invites", {
	groupId: integer("group_id").notNull().references(() => groups.id),
	inviteeEmail: text("invitee_email").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		groupInvitesGroupIdInviteeEmailPk: primaryKey({ columns: [table.groupId, table.inviteeEmail], name: "group_invites_group_id_invitee_email_pk"})
	}
});

export const hostTeamInvites = pgTable("host_team_invites", {
	hostTeamId: integer("host_team_id").notNull().references(() => hostTeams.id, { onDelete: "cascade" } ),
	inviteeEmail: text("invitee_email").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		hostTeamIdIdx: index().on(table.hostTeamId),
		hostTeamInvitesHostTeamIdInviteeEmailPk: primaryKey({ columns: [table.hostTeamId, table.inviteeEmail], name: "host_team_invites_host_team_id_invitee_email_pk"})
	}
});

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"})
	}
});