import { sendEmail } from "@/server/server-utils";
import RequestOutreachEmail from "packages/transactional/emails/RequestOutreachEmail";
import { secondaryDb } from "@/server/db";
import { eq, sql } from "drizzle-orm"; // Import 'eq' for database queries
import { propertyManagerContactsTest as propertyManagerContacts, propertyManagerContactsTest } from "@/server/db/secondary-schema";
import { cities } from "@/server/db/secondary-schema/cities";
import { warmLeads } from "@/server/db/secondary-schema/warmLeads";
//import { propertyManagerContacts } from "@/server/db/secondary-schema";

// Add the import for the fetch API for making HTTP requests to the Instantly.ai API
import { env } from "@/env";

interface EmailPMFromCityRequestInput {
  requestLocation: string;
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  requestId: string;
  pricePerNight: number;
  totalPrice: number;
  requestedLocationLatLng?: {
    lat: number | undefined;
    lng: number | undefined;
  };
  radius?: number; // You might remove radius from input as prompt is radius-free now
}

export async function emailPMFromCityRequest(
  input: EmailPMFromCityRequestInput,
) {
  console.log("is this running ? ", input);
  if (
    !input.requestedLocationLatLng?.lat ||
    !input.requestedLocationLatLng.lat
  ) {
    console.log("No requestedLocationLatLng provided, exiting function.");
    return; // Early return if latLng is missing, mirroring the tRPC behavior
  }

  console.log("Input LatLng:", input.requestedLocationLatLng);

  try {
    const requestedPoint = sql`ST_SetSRID(ST_MakePoint(${input.requestedLocationLatLng.lng}, ${input.requestedLocationLatLng.lat}), 4326)`;
    const transformedInputPoint = sql`ST_Transform(${requestedPoint}, 3857)`;
    const transformedLatLngPoint = sql`ST_Transform(lat_lng_point, 3857)`;

    const nearbyProperyManagers = await secondaryDb
      .select({
        id: propertyManagerContacts.id,
        email: propertyManagerContacts.email,
        propertyManagerName: propertyManagerContacts.name,
        lastEmailSentAt: propertyManagerContacts.lastEmailSentAt,
        latLngPoint: sql<string>`ST_AsText(lat_lng_point)`.as("latLngPoint"),
        distanceMeters: sql<number>`
          ST_Distance(
            ${transformedLatLngPoint},
            ${transformedInputPoint}
          )
        `.as("distance_meters"),
      })
      .from(propertyManagerContactsTest)
      .where(
        sql`
          lat_lng_point IS NOT NULL
          AND ST_DWithin(
            ${transformedLatLngPoint},
            ${transformedInputPoint},
            10000 -- RADIUS_FALL_BACK - replace with your constant if needed, or pass radius as input
          )
        `,
      ) // Assuming RADIUS_FALL_BACK is defined elsewhere or replace with a number like 10000
      .orderBy(sql`distance_meters ASC`)
      .limit(4);

    console.log("Nearby Property Managers:", nearbyProperyManagers);

    // <------------------------------------------------------- EMAIL SECTION -------------------------------------------------->
    console.log("Managers to email:", nearbyProperyManagers); // Log managers to be emailed

    for (const manager of nearbyProperyManagers) {
      if (!manager.email || manager.email.length < 1) {
        console.log(`Skipping email for manager without email:`, manager);
        continue; // Skip to the next manager if email is missing
      }

      // Check if lastEmailSentAt is within the last 3 days (as previously implemented)
      if (manager.lastEmailSentAt) {
        const lastSentDate = new Date(manager.lastEmailSentAt);
        const now = new Date();
        const timeDiff = now.getTime() - lastSentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 3) {
          console.log(
            `Skipping email for manager ${manager.propertyManagerName} (last email sent ${daysDiff} days ago, which is within 3 days).`,
          );
          continue; // Skip to the next manager if last email was sent recently
        }
      }
      const sentEmails = new Set<string>(); // Initialize a Set to track sent emails

      for (const email of manager.email) {
        if (sentEmails.has(email)) {
          // Check if email is already in the Set
          console.log(`Skipping duplicate email to: ${email}`);
          continue; // Skip to the next email if already sent in this run
        }

        try {
          await sendEmail({
            to: email,
            subject: `Tramona: Booking request for ${input.requestLocation}`,
            content: RequestOutreachEmail({
              requestLocation: input.requestLocation, // Email content still uses requestLocation for now
              checkIn: input.checkIn,
              checkOut: input.checkOut,
              numOfGuest: input.numGuests,
              requestId: input.requestId,
              maximumPerNightAmount: input.pricePerNight,
              requestAmount: input.totalPrice,
            }),
          });
          console.log(`Email sent to: ${email}`);
          sentEmails.add(email); // Add email to the Set after successful sending
          await secondaryDb
            .update(propertyManagerContacts)
            .set({
              lastEmailSentAt: new Date(),
            })
            .where(eq(propertyManagerContacts.id, manager.id));
        } catch {
          continue;
        }
      }
    }
    return;
  } catch (err) {
    console.error("Error in emailPMFromCityRequest:", err);
  }
}


interface EmailWarmLeadsFromCityRequestInput {
  requestLocation: string;
  requestedLocationLatLng?: {
    lat: number | undefined;
    lng: number | undefined;
  };
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  requestId: string;
  pricePerNight: number;
  totalPrice: number;
}

export async function emailWarmLeadsFromCityRequest(
  input: EmailWarmLeadsFromCityRequestInput,
) {
  console.log("Processing warm leads email request:", input);

  if (!input.requestedLocationLatLng?.lat || !input.requestedLocationLatLng.lng) {
    console.log("No requestedLocationLatLng provided, exiting function.");
    return;
  }

  console.log("Input LatLng:", input.requestedLocationLatLng);

  try {
    const requestedPoint = sql`ST_SetSRID(ST_MakePoint(${input.requestedLocationLatLng.lng}, ${input.requestedLocationLatLng.lat}), 4326)`;
    const transformedInputPoint = sql`ST_Transform(${requestedPoint}, 3857)`;
    const transformedLatLngPoint = sql`ST_Transform(cities.lat_lng_point, 3857)`;

    const warmLeadsToEmail = await secondaryDb
      .select({
        id: warmLeads.id,
        email: warmLeads.email,
        lastEmailSentAt: warmLeads.lastEmailSentAt,
      })
      .from(warmLeads)
      .where(
        sql`EXISTS (
          SELECT 1 FROM ${cities}
          WHERE cities.warm_lead_id = warm_leads.id
          AND cities.lat_lng_point IS NOT NULL
          AND ST_DWithin(
            ${transformedLatLngPoint},
            ${transformedInputPoint},
            10000
          )
        )`
      );

    console.log("Warm leads to email:", warmLeadsToEmail);

    for (const lead of warmLeadsToEmail) {
      if (!lead.email) {
        console.log(`Skipping warm lead ${lead.id} due to missing email.`);
        continue;
      }

      if (lead.lastEmailSentAt) {
        const lastSentDate = new Date(lead.lastEmailSentAt);
        const now = new Date();
        const daysDiff = Math.ceil((now.getTime() - lastSentDate.getTime()) / (1000 * 3600 * 24));

        if (daysDiff <= 3) {
          console.log(`Skipping email for warm lead ${lead.id}, last email sent ${daysDiff} days ago.`);
          continue;
        }
      }

      try {
        await sendEmail({
          to: lead.email,
          subject: `Tramona: Booking request for ${input.requestLocation}`,
          content: RequestOutreachEmail({
            requestLocation: input.requestLocation,
            checkIn: input.checkIn,
            checkOut: input.checkOut,
            numOfGuest: input.numGuests,
            requestId: input.requestId,
            maximumPerNightAmount: input.pricePerNight,
            requestAmount: input.totalPrice,
          }),
        });
        console.log(`Email sent to warm lead: ${lead.email}`);

        await secondaryDb
          .update(warmLeads)
          .set({ lastEmailSentAt: new Date() })
          .where(eq(warmLeads.id, lead.id));
      } catch (err) {
        console.error(`Failed to send email to warm lead ${lead.id}:`, err);
        continue;
      }
    }
  } catch (err) {
    console.error("Error in emailWarmLeadsFromCityRequest:", err);
  }
}

// Add interfaces for campaign tracking
interface CampaignTrackingRecord {
  campaignId: string;
  location: {
    lat: number;
    lng: number;
    radiusKm: number;
  };
  createdAt: Date;
  completedAt?: Date;
  leadCount: number;
}

// Add this new interface for the Instantly.ai campaign creation
interface CreateInstantlyCampaignInput {
  campaignName: string;
  locationFilter?: {
    lat: number;
    lng: number;
    radiusKm?: number; // Optional radius in kilometers, defaults to 10km if not provided
  };
  maxLeads?: number; // Maximum number of leads to include in the campaign, defaults to 100
  skipRecentlyContacted?: boolean; // Whether to skip leads that were contacted recently, defaults to true
  customVariables?: Record<string, string | number | boolean>; // Custom variables to include with the leads
  // Campaign schedule options
  scheduleOptions?: {
    startTime?: string; // Format: "HH:MM", default "09:00"
    endTime?: string; // Format: "HH:MM", default "17:00"
    timezone?: string; // Must be one of the Instantly.ai supported timezones like "America/Chicago", "Etc/GMT+10", etc.
    workDays?: boolean[]; // Array of 7 booleans representing days [Sun, Mon, Tue, Wed, Thu, Fri, Sat], defaults to weekdays
    startDate?: Date; // Optional start date for the campaign
    endDate?: Date; // Optional end date for the campaign
  };
  forceCampaign?: boolean; // Force creation of a new campaign even if cooldown period hasn't elapsed
}

// List of valid Instantly.ai timezone values
const VALID_INSTANTLY_TIMEZONES = [
  "Etc/GMT+12",
  "Etc/GMT+11",
  "Etc/GMT+10",
  "America/Anchorage",
  "America/Dawson",
  "America/Creston",
  "America/Chihuahua",
  "America/Boise",
  "America/Belize",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Los_Angeles"
  // There are more, but these are common ones
];

// In-memory cache of recent campaigns (in a production app, this should be stored in a database)
const recentCampaigns: CampaignTrackingRecord[] = [];

/**
 * Finds a recent campaign for a given location within the specified cooldown period
 * @param location The location to check
 * @param cooldownDays Number of days to consider for cooldown
 * @returns The most recent campaign for the location, or null if none exists
 */
function findRecentCampaignForLocation(
  location: { lat: number; lng: number; radiusKm?: number },
  cooldownDays = 2
): CampaignTrackingRecord | null {
  if (!location.lat || !location.lng) return null;

  const now = new Date();
  const cooldownThreshold = new Date(now.getTime() - cooldownDays * 24 * 60 * 60 * 1000);

  // Filter campaigns to find those that are for a nearby location and within the cooldown period
  const radiusKm = location.radiusKm ?? 10;
  const recentLocationCampaigns = recentCampaigns.filter(campaign => {
    // Check if created within cooldown period
    if (campaign.createdAt < cooldownThreshold) return false;

    // Calculate approximate distance between locations (simple haversine formula)
    const earthRadiusKm = 6371;
    const dLat = (campaign.location.lat - location.lat) * Math.PI / 180;
    const dLng = (campaign.location.lng - location.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(location.lat * Math.PI / 180) * Math.cos(campaign.location.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    // Check if the campaign is within the radius (either campaign's or current request's)
    return distance <= Math.max(radiusKm, campaign.location.radiusKm);
  });

  // Sort by creation date (newest first) and return the first one if any
  return recentLocationCampaigns.sort((a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime()
  )[0] ?? null;
}

/**
 * Tracks campaign creation
 * @param campaignId The ID of the created campaign
 * @param location The location for the campaign
 * @param leadCount Number of leads in the campaign
 */
function trackCampaignCreation(
  campaignId: string,
  location: { lat: number; lng: number; radiusKm: number },
  leadCount: number
): void {
  recentCampaigns.push({
    campaignId,
    location,
    createdAt: new Date(),
    leadCount
  });

  // Prune old campaigns (older than 7 days) to prevent memory bloat
  const pruneThreshold = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  const pruneIndex = recentCampaigns.findIndex(c => c.createdAt < pruneThreshold);
  if (pruneIndex !== -1) {
    recentCampaigns.splice(0, pruneIndex + 1);
  }
}

/**
 * Creates a campaign in Instantly.ai using leads from the warm leads table
 * @param input Parameters for creating the Instantly.ai campaign
 * @returns A promise that resolves to the created campaign ID if successful
 */
export async function createInstantlyCampaign(
  input: CreateInstantlyCampaignInput,
): Promise<string | null> {
  console.log("Creating Instantly.ai campaign:", input);

  // Validate that we have an API key configured
  if (!env.INSTANTLY_API_KEY) {
    console.error("INSTANTLY_API_KEY is not configured in environment variables");
    return null;
  }

  // Check for recent campaigns for this location if location filter is provided
  if (input.locationFilter && !input.forceCampaign) {
    const recentCampaign = findRecentCampaignForLocation(input.locationFilter);
    if (recentCampaign) {
      console.log(`Found recent campaign ${recentCampaign.campaignId} for this location created on ${recentCampaign.createdAt.toISOString()}.`);
      console.log(`Skipping campaign creation due to cooldown period. Use forceCampaign=true to override.`);
      return recentCampaign.campaignId; // Return the existing campaign ID
    }
  }

  try {
    // 1. First, query the warm leads from the database based on filters
    const queryBuilder = secondaryDb
      .select({
        id: warmLeads.id,
        email: warmLeads.email,
        lastEmailSentAt: warmLeads.lastEmailSentAt,
      })
      .from(warmLeads);

    // Apply location filtering if specified
    if (input.locationFilter) {
      const { lat, lng, radiusKm = 10 } = input.locationFilter;
      const requestedPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;
      const transformedInputPoint = sql`ST_Transform(${requestedPoint}, 3857)`;
      const transformedLatLngPoint = sql`ST_Transform(cities.lat_lng_point, 3857)`;

      void queryBuilder.where(
        sql`EXISTS (
          SELECT 1 FROM ${cities}
          WHERE cities.warm_lead_id = warm_leads.id
          AND cities.lat_lng_point IS NOT NULL
          AND ST_DWithin(
            ${transformedLatLngPoint},
            ${transformedInputPoint},
            ${radiusKm * 1000} -- Convert km to meters
          )
        )`
      );
    }

    // Skip recently contacted leads if specified
    if (input.skipRecentlyContacted !== false) {
      void queryBuilder.where(
        sql`warm_leads.last_email_sent_at IS NULL OR warm_leads.last_email_sent_at < NOW() - INTERVAL '3 days'`
      );
    }

    // Limit the number of leads
    const maxLeads = input.maxLeads ?? 100;
    const warmLeadsToAdd = await queryBuilder.limit(maxLeads);

    console.log(`Found ${warmLeadsToAdd.length} warm leads to add to Instantly.ai campaign`);

    if (warmLeadsToAdd.length === 0) {
      console.log("No leads found to add to campaign, aborting");
      return null;
    }

    // Set default schedule options if not provided - modified to ensure emails are sent within 1 day
    const scheduleOptions = input.scheduleOptions ?? {};
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startTime = scheduleOptions.startTime ?? "09:00";
    const endTime = scheduleOptions.endTime ?? "17:00";
    const timezone = scheduleOptions.timezone ?? "America/Chicago"; // Using a known valid timezone
    // Default to every day (to ensure emails are sent within 1 day window)
    const workDays = scheduleOptions.workDays ?? [true, true, true, true, true, true, true];

    // Validate the timezone
    if (!VALID_INSTANTLY_TIMEZONES.includes(timezone)) {
      console.warn(`Warning: The timezone "${timezone}" may not be supported by Instantly.ai.
        If campaign creation fails, try one of these timezones: ${VALID_INSTANTLY_TIMEZONES.join(", ")}`);
    }

    // Convert workDays array to the format expected by Instantly.ai
    const daysObject: Record<string, boolean> = {};
    workDays.forEach((isActive, index) => {
      daysObject[index.toString()] = isActive;
    });

    // 2. Create a new campaign in Instantly.ai with the required campaign_schedule
    type CampaignPayload = {
      name: string;
      campaign_schedule: {
        schedules: Array<{
          name: string;
          timing: {
            from: string;
            to: string;
          };
          days: Record<string, boolean>;
          timezone: string;
        }>;
        start_date?: string;
        end_date?: string;
      };
      // Add one-time campaign settings
      is_evergreen: boolean;
      email_gap: number; // Send emails close together
      random_wait_max: number; // Small random wait time
    };

    const campaignPayload: CampaignPayload = {
      name: input.campaignName,
      campaign_schedule: {
        schedules: [
          {
            name: "Default Schedule",
            timing: {
              from: startTime,
              to: endTime
            },
            days: daysObject,
            timezone: timezone
          }
        ],
        // Set start date to today
        start_date: now.toISOString(),
        // Set end date to tomorrow to ensure it's a one-time send
        end_date: tomorrow.toISOString()
      },
      // Set this to false for one-time campaign (not evergreen)
      is_evergreen: false,
      // Send emails closer together (5 minutes between emails)
      email_gap: 5,
      // Small random wait time (2 minutes max)
      random_wait_max: 2
    };

    const createCampaignResponse = await fetch("https://api.instantly.ai/api/v2/campaigns", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignPayload),
    });

    if (!createCampaignResponse.ok) {
      console.error("Failed to create campaign in Instantly.ai:", await createCampaignResponse.text());
      return null;
    }

    // Parse campaign response
    const campaignData = await createCampaignResponse.json() as { id: string };
    const campaignId = campaignData.id;

    console.log(`Created Instantly.ai campaign with ID: ${campaignId}`);

    // Track this campaign for future reference
    if (input.locationFilter) {
      trackCampaignCreation(
        campaignId,
        {
          lat: input.locationFilter.lat,
          lng: input.locationFilter.lng,
          radiusKm: input.locationFilter.radiusKm ?? 10
        },
        warmLeadsToAdd.length
      );
    }

    // 3. Add the leads to the campaign
    for (const lead of warmLeadsToAdd) {
      if (!lead.email) {
        console.log(`Skipping lead ${lead.id} due to missing email.`);
        continue;
      }

      try {
        const addLeadResponse = await fetch("https://api.instantly.ai/api/v2/leads", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign: campaignId,
            email: lead.email,
            // Add any other lead parameters as needed
            custom_variables: input.customVariables ?? {},
          }),
        });

        if (!addLeadResponse.ok) {
          console.error(`Failed to add lead ${lead.id} to campaign:`, await addLeadResponse.text());
          continue;
        }

        // Update the lastEmailSentAt field in the database
        await secondaryDb
          .update(warmLeads)
          .set({ lastEmailSentAt: new Date() })
          .where(eq(warmLeads.id, lead.id));

        console.log(`Added lead ${lead.id} to campaign and updated lastEmailSentAt`);
      } catch (err) {
        console.error(`Error adding lead ${lead.id} to campaign:`, err);
      }
    }

    // 4. Start the campaign immediately
    try {
      const startCampaignResponse = await fetch(`https://api.instantly.ai/api/v2/campaigns/${campaignId}/start`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
          "Content-Type": "application/json",
        }
      });

      if (!startCampaignResponse.ok) {
        console.error("Failed to start campaign:", await startCampaignResponse.text());
      } else {
        console.log(`Successfully started campaign ${campaignId}`);
      }
    } catch (err) {
      console.error("Error starting campaign:", err);
    }

    console.log(`Successfully created Instantly.ai campaign with ID: ${campaignId} and added ${warmLeadsToAdd.length} leads.`);
    return campaignId;

  } catch (err) {
    console.error("Error in createInstantlyCampaign:", err);
    return null;
  }
}