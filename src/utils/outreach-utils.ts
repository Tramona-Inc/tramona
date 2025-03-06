import { sendEmail } from "@/server/server-utils";
import RequestOutreachEmail from "packages/transactional/emails/RequestOutreachEmail";
import { secondaryDb } from "@/server/db";
import { eq, sql } from "drizzle-orm"; // Import 'eq' for database queries
import { propertyManagerContacts, propertyManagerContactsTest } from "@/server/db/secondary-schema";
import { cities } from "@/server/db/secondary-schema/cities";
import { warmLeads } from "@/server/db/secondary-schema/warmLeads";
//import { propertyManagerContacts } from "@/server/db/secondary-schema";

// Add the import for the fetch API for making HTTP requests to the Instantly.ai API
import { env } from "@/env";
import axios, { AxiosError } from 'axios';

// Add the proper type import for the property managers table
import { PropertyManagerContact } from "@/server/db/schema/tables/outreach";

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
    const transformedLatLngPoint = sql`ST_Transform(ST_SetSRID(lat_lng_point::geometry, 4326), 3857)`;

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
      .from(propertyManagerContacts)
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
    const transformedLatLngPoint = sql`ST_Transform(ST_SetSRID(cities.lat_lng_point::geometry, 4326), 3857)`;

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
  onlyWarmLeads?: boolean; // Only add warm leads to the campaign
  sequences?: {
    steps: {
      type: string;
      delay: number;
      variants: {
        subject: string;
        body: string;
      }[];
    }[];
  }[];
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

  try {
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

    // Create a new campaign in Instantly.ai with the required campaign_schedule
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
      sequences: Array<{
        steps: Array<{
          type: string;
          delay: number;
          variants: Array<{
            subject: string;
            body: string;
          }>;
        }>;
      }>;
      is_evergreen: boolean;
      email_gap: number;
      random_wait_max: number;
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
        start_date: now.toISOString(),
        end_date: tomorrow.toISOString()
      },
      sequences: [
        {
          steps: input.sequences?.[0]?.steps ?? []
        }
      ],
      is_evergreen: false,
      email_gap: 5,
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

    console.log(`Created new Instantly.ai campaign with ID: ${campaignId}`);

    // Query for leads to add to the campaign
    type LeadInfo = {
      id: number;
      email: string | string[] | null;
      lastEmailSentAt: Date | null;
      type: 'warm_lead' | 'property_manager';
    };

    // Query warm leads
    const queryBuilder = secondaryDb
      .select({
        id: warmLeads.id,
        email: warmLeads.email,
        lastEmailSentAt: warmLeads.lastEmailSentAt,
        type: sql<'warm_lead'>`'warm_lead'::text`.as('type'),
      })
      .from(warmLeads);

    // Apply location filtering if specified
    if (input.locationFilter) {
      const { lat, lng, radiusKm = 10 } = input.locationFilter;
      const requestedPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;
      const transformedInputPoint = sql`ST_Transform(${requestedPoint}, 3857)`;
      const transformedLatLngPoint = sql`ST_Transform(ST_SetSRID(cities.lat_lng_point::geometry, 4326), 3857)`;

      void queryBuilder.where(
        sql`EXISTS (
          SELECT 1 FROM ${cities}
          WHERE cities.warm_lead_id = warm_leads.id
          AND cities.lat_lng_point IS NOT NULL
          AND ST_DWithin(
            ${transformedLatLngPoint},
            ${transformedInputPoint},
            ${radiusKm}
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

    // Query property manager contacts
    let propertyManagersToAdd: LeadInfo[] = [];

    if (input.locationFilter && !input.onlyWarmLeads) {
      const { lat, lng, radiusKm = 10 } = input.locationFilter;
      const requestedPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;
      const transformedInputPoint = sql`ST_Transform(${requestedPoint}, 3857)`;

      // Query property managers within the radius
      const pmQueryBuilder = secondaryDb
        .select({
          id: propertyManagerContacts.id,
          email: propertyManagerContacts.email,
          lastEmailSentAt: propertyManagerContacts.lastEmailSentAt,
          type: sql<'property_manager'>`'property_manager'::text`.as('type'),
          distanceMeters: sql<number>`
            ST_Distance(
              ST_Transform(ST_SetSRID(${propertyManagerContacts}.lat_lng_point::geometry, 4326), 3857),
              ${transformedInputPoint}
            )
          `.as('distance_meters'),
        })
        .from(propertyManagerContacts)
        .where(
          sql`${propertyManagerContacts}.lat_lng_point IS NOT NULL
              AND ST_DWithin(
                ST_Transform(ST_SetSRID(${propertyManagerContacts}.lat_lng_point::geometry, 4326), 3857),
                ${transformedInputPoint},
                ${radiusKm}
              )`
        );

      // Skip recently contacted property managers if specified
      const skipRecentlyContacted = input.skipRecentlyContacted !== false;
      let propertyManagerResults = await pmQueryBuilder.limit(maxLeads);

      // Filter out recently contacted property managers if needed
      if (skipRecentlyContacted) {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        propertyManagersToAdd = propertyManagerResults.filter(
          pm => !pm.lastEmailSentAt || pm.lastEmailSentAt < threeDaysAgo
        );
      } else {
        propertyManagersToAdd = propertyManagerResults;
      }

      console.log(`Found ${propertyManagersToAdd.length} property managers to add to Instantly.ai campaign`);
    }

    // Combine both lead sources
    const allLeads = [...warmLeadsToAdd, ...propertyManagersToAdd];

    // Only proceed if we have leads to add
    // if (allLeads.length === 0) {
    //   console.log('No leads to add to campaign, deleting campaign');
    //   await fetch(`https://api.instantly.ai/api/v2/campaigns/${campaignId}`, {
    //     method: "DELETE",
    //     headers: {
    //       "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   return null;
    // }

    // First, update lastEmailSentAt for all leads
    const updatePromises: Promise<unknown>[] = [];

    for (const lead of allLeads) {
      if (!lead.email) continue;

      if (lead.type === 'warm_lead') {
        updatePromises.push(
          secondaryDb
            .update(warmLeads)
            .set({ lastEmailSentAt: now })
            .where(eq(warmLeads.id, lead.id))
        );
      } else {
        updatePromises.push(
          secondaryDb
            .update(propertyManagerContacts)
            .set({ lastEmailSentAt: now })
            .where(eq(propertyManagerContacts.id, lead.id))
        );
      }
    }

    // Wait for all updates to complete
    await Promise.all(updatePromises);
    console.log(`Updated lastEmailSentAt for ${updatePromises.length} leads`);

    // Now add leads to the campaign
    for (const lead of allLeads) {
      if (!lead.email) {
        console.log(`Skipping lead ${lead.id} due to missing email.`);
        continue;
      }

      try {
        // Handle both string and array email formats
        const emails = Array.isArray(lead.email) ? lead.email : [lead.email];

        for (const email of emails) {
          if (!email) continue;

          const addLeadResponse = await fetch("https://api.instantly.ai/api/v2/leads", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              campaign: campaignId,
              email: email,
              custom_variables: {
                ...input.customVariables ?? {},
                lead_type: lead.type,
              },
            }),
          });

          if (!addLeadResponse.ok) {
            console.error(`Failed to add lead ${lead.id} with email ${email} to campaign:`, await addLeadResponse.text());
            continue;
          }

          console.log(`Added ${lead.type} with email ${email} to campaign`);
        }
      } catch (err) {
        console.error(`Error adding lead ${lead.id} to campaign:`, err);
      }
    }

    // Start the campaign
    try {
      console.log(`Starting campaign ${campaignId} with Instantly.ai API...`);
      const startResponse = await fetch(
        `https://api.instantly.ai/api/v2/campaigns/${campaignId}/activate`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Add empty JSON object as body
        }
      );

      if (!startResponse.ok) {
        const errorData = await startResponse.text();
        console.error(`Failed to activate campaign ${campaignId}:`, {
          status: startResponse.status,
          statusText: startResponse.statusText,
          data: errorData
        });
      } else {
        console.log(`Successfully activated campaign ${campaignId}`);
      }
    } catch (error) {
      console.error(`Error activating campaign ${campaignId}:`, error);
    }

    console.log(`Successfully processed Instantly.ai campaign with ID: ${campaignId} and added ${allLeads.length} leads.`);
    return campaignId;

  } catch (err) {
    console.error("Error in createInstantlyCampaign:", err);
    return null;
  }
}