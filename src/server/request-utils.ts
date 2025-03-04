import { formatDateRange } from "@/utils/utils";

import { RequestInput } from "./api/routers/requestsRouter";

import { db, secondaryDb } from "./db";
import { waitUntil } from "@vercel/functions";
import { formatCurrency, getNumNights, plural } from "@/utils/utils";
import { eq } from "drizzle-orm";
import {
  groupMembers,
  groups,
  properties,
  offers,
  requests,
  users,
} from "./db/schema";
import { getCoordinates } from "./google-maps";
import { sendSlackMessage } from "./slack";
import { Session } from "next-auth";
import { TRPCError } from "@trpc/server";
import {
  haversineDistance,
  createLatLngGISPoint,
  getPropertiesForRequest,
  sendTextToHost,
} from "./server-utils";
import { scrapeDirectListings } from "./direct-sites-scraping";
import { scrapeAirbnbPrice } from "./scrapePrice";
import {
  getTravelerOfferedPrice,
  baseAmountToHostPayout,
} from "@/utils/payment-utils/paymentBreakdown";
import { differenceInDays } from "date-fns";
import { generateFakeUser } from "./server-utils";
import { createInstantlyCampaign } from "@/utils/outreach-utils";
import { sql } from "drizzle-orm";

interface ScraperResponse {
  message: string;
  success: boolean;
}

interface PropertyManagerEmail {
  email: string | string[];
}

export async function handleRequestSubmission(
  input: RequestInput,
  { user }: { user: Session["user"] },
) {
  console.log("hit");
  console.log(input.lat, input.location, input);

  // Trigger lambda scraping functions

  // Begin a transaction
  const transactionResults = await db.transaction(async (tx) => {
    const madeByGroupId = await tx
      .insert(groups)
      .values({ ownerId: user.id })
      .returning()
      .then((res) => res[0]!.id);

    await tx.insert(groupMembers).values({
      userId: user.id,
      groupId: madeByGroupId,
    });

    let lat = input.lat;
    let lng = input.lng;
    let radius = input.radius;

    if (lat === undefined || lng === undefined || radius === undefined) {
      const coordinates = await getCoordinates(input.location);
      console.log(coordinates, "coordinates ");
      if (coordinates.location) {
        lat = coordinates.location.lat;
        lng = coordinates.location.lng;
        if (coordinates.bounds) {
          radius =
            haversineDistance(
              coordinates.bounds.northeast.lat,
              coordinates.bounds.northeast.lng,
              coordinates.bounds.southwest.lat,
              coordinates.bounds.southwest.lng,
            ) / 2;
        } else {
          radius = 10;
        }
      }
    }
    let latLngPoint = null;
    if (lat && lng) {
      latLngPoint = createLatLngGISPoint({ lat, lng });
    }

    const pricePerNight = input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut);
    const totalPrice = input.maxTotalPrice;

    // Send emails to property managers and warm leads
    if (!radius || !latLngPoint) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to get coordinates for the location",
      });
    }

    const request = await tx
      .insert(requests)
      .values({ ...input, madeByGroupId, latLngPoint, radius })
      .returning({ latLngPoint: requests.latLngPoint, id: requests.id })
      .then((res) => res[0]!);


    waitUntil(
      scrapeDirectListings({
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        requestNightlyPrice:
          input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut),
        requestId: request.id,
        location: input.location,
        latitude: lat,
        longitude: lng,
        numGuests: input.numGuests,
      }).catch((error) => {
        console.error("Error scraping listings: " + error);
      }),
    );

    const eligibleProperties = await getPropertiesForRequest(
      { ...input, id: request.id, latLngPoint: request.latLngPoint, radius },
      { tx },
    );

    const numNights = getNumNights(input.checkIn, input.checkOut);
    const requestedNightlyPrice = input.maxTotalPrice / numNights;

    const eligiblePropertiesWithAutoOffers = eligibleProperties.filter(
      (property) =>
        property.autoOfferEnabled &&
        property.originalListingId !== "877854804496138577",
    );

    const autoOfferPromises = eligiblePropertiesWithAutoOffers.map(
      async (property) => {
        try {
          const propertyDetails = await tx.query.properties.findFirst({
            where: eq(properties.id, property.id),
          });

          if (
            propertyDetails?.autoOfferEnabled &&
            propertyDetails.originalListingId &&
            propertyDetails.originalListingPlatform === "Airbnb" &&
            propertyDetails.discountTiers
          ) {
            const airbnbTotalPrice = await scrapeAirbnbPrice({
              airbnbListingId: propertyDetails.originalListingId,
              params: {
                checkIn: input.checkIn,
                checkOut: input.checkOut,
                numGuests: input.numGuests,
              },
            });

            if (!airbnbTotalPrice) {
              return;
            }
            const airbnbNightlyPrice = airbnbTotalPrice / numNights;

            const percentOff =
              ((airbnbNightlyPrice - requestedNightlyPrice) /
                airbnbNightlyPrice) *
              100;

            const daysUntilCheckIn = differenceInDays(
              input.checkIn,
              new Date(),
            );

            const applicableDiscount = propertyDetails.discountTiers.find(
              (tier) => daysUntilCheckIn >= tier.days,
            );

            if (
              applicableDiscount &&
              percentOff <= applicableDiscount.percentOff
            ) {
              // create offer
              const calculatedTravelerPrice = getTravelerOfferedPrice({
                totalBasePriceBeforeFees: requestedNightlyPrice * numNights,
              });

              await tx.insert(offers).values({
                requestId: request.id,
                propertyId: property.id,
                totalBasePriceBeforeFees: input.maxTotalPrice,
                hostPayout: baseAmountToHostPayout(
                  requestedNightlyPrice * numNights,
                ),
                calculatedTravelerPrice,
                checkIn: input.checkIn,
                checkOut: input.checkOut,
              });
            }
          }
        } catch (error) {
          console.error(
            `Error processing auto-offer for property ${property.id}:`,
            error,
          );
        }
      },
    );

    // Execute all auto offer promises simultaneously
    const results = await Promise.allSettled(autoOfferPromises);

    // Optional: You can process the results to log the outcome of each promise
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Error with property ${eligiblePropertiesWithAutoOffers[index]?.id}:`,
          result.reason,
        );
      }
    });

    const propertiesWithoutAutoOffers = eligibleProperties.filter(
      (property) => !property.autoOfferEnabled,
    );

    if (!user.isBurner) {
      await sendTextToHost({
        matchingProperties: propertiesWithoutAutoOffers,
        request: input,
        tx,
      });
    }

    return { requestId: request.id, madeByGroupId };
  });

  // Messaging based on user preferences or environment.
  const name = user.name ?? user.email;
  const pricePerNight =
    input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(input.checkIn, input.checkOut);
  const fmtdNumGuests = plural(input.numGuests ?? 1, "guest");

  if (user.role !== "admin") {
    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `*${name} just made a request: ${input.location}*`,
        `requested ${fmtdPrice}/night · ${fmtdDateRange} · ${fmtdNumGuests}`,
        `<https://tramona.com/admin|Go to admin dashboard>`,
      ].join("\n"),
    });
  }

  // Run the Instantly.ai campaign creation asynchronously
  // This way, even if it fails, the request submission will have already been completed
  const campaignPromise = (async () => {
    try {
      const lat = input.lat;
      const lng = input.lng;
      const radius = input.radius;
      const requestId = transactionResults.requestId;
      const requestedPoint = createLatLngGISPoint({ lat: lat ?? 0, lng: lng ?? 0 });

      // Check for existing property managers
      const propertyManagers = await secondaryDb.execute(sql`
        SELECT COUNT(*) as count
        FROM property_manager_contacts
        WHERE lat_lng_point IS NOT NULL
        AND ST_DWithin(
          ST_Transform(lat_lng_point, 3857),
          ST_Transform(${requestedPoint}, 3857),
          ${(radius ?? 10) * 1000}
        )
      `);

      const pmCount = Number(propertyManagers[0]?.count ?? 0);
      console.log(`Found ${pmCount} property managers in the requested location.`);

      const baseUrl = "https://www.tramona.com";
      const fmtdDateRange = formatDateRange(input.checkIn, input.checkOut);
      const emailBody = `
        Tramona: New Booking Request for ${input.location}

        We have a new booking request for your property in ${input.location}!

        Request Details:
        Location: ${input.location}
        Dates: ${fmtdDateRange}
        Number of guests: ${plural(input.numGuests ?? 1, "guest")}
        Potential earnings for your empty night: ${input.maxTotalPrice ? formatCurrency(input.maxTotalPrice) : "N/A"}

        What is Tramona?

        1. Tramona is the only OTA built to supplement other booking channels, and fill your empty nights
        2. Tramona charges 5-10% less in fees so every booking puts more in your pocket
        3. All bookings come with $50,000 of protection.
        4. Sign up instantly, with our direct Airbnb connection. This auto connects your calendars, pricing, properties and anything else on Airbnb

        Log in now to review and accept this booking request at: ${baseUrl}/request-preview/${requestId}

        Not quite the booking you're looking for? No worries! We have travelers making requests every day.

        Questions about this request?
        Email us at info@tramona.com
        `.trim();

      // Create campaign immediately (no emails yet)
      const campaignId = await createInstantlyCampaign({
        campaignName: `Booking Request: ${input.location} ${formatDateRange(input.checkIn, input.checkOut)}`,
        locationFilter: {
          lat: lat ?? 0,
          lng: lng ?? 0,
          radiusKm: radius ?? 0,
        },
        customVariables: {
          requestLocation: input.location,
          requestId: requestId.toString(),
          checkInDate: input.checkIn.toISOString(),
          checkOutDate: input.checkOut.toISOString(),
          numGuests: input.numGuests ?? 1,
          pricePerNight: pricePerNight,
          totalPrice: input.maxTotalPrice,
          numNights: getNumNights(input.checkIn, input.checkOut),
        },
        scheduleOptions: {
          startTime: "09:00",
          endTime: "20:00",
          startDate: new Date(),
        },
        sequences: {
          steps: [
            {
              subject: `Booking Request for ${input.location}`,
              body: emailBody,
              delay: 0
            }
          ]
        }
      });

      if (!campaignId) {
        throw new Error("Failed to create Instantly.ai campaign - no campaign ID returned");
      }
      console.log(`Created Instantly.ai campaign ${campaignId} for request ${requestId}`);

      // Trigger scraper and incrementally add emails
      if (pmCount === 0) {
        console.log(`No property managers found for ${input.location}, triggering scraper...`);
        try {
          const scraperResponse = await fetch("https://googlescrape.onrender.com/scrape", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ location: input.location }),
          });

          if (!scraperResponse.ok) {
            const errorData = await scraperResponse.json() as { message?: string };
            throw new Error(errorData.message ?? "Scraper request failed");
          }

          const result = await scraperResponse.json() as ScraperResponse;
          console.log(`Scheduled property manager scraping for ${input.location}: ${result.message}`);

          // Poll Supabase for 3 minutes, adding emails incrementally
          const startTime = Date.now();
          const addedEmails = new Set<string>(); // Track added emails to avoid duplicates

          while (Date.now() - startTime < 180000) { // 3-minute window
            const queryResult = await secondaryDb.execute(sql`
              SELECT email
              FROM property_manager_contacts
              WHERE city = ${input.location}
            `);

            const propertyManagers = queryResult.map(row => ({
              email: row.email as string | string[]
            })) as PropertyManagerEmail[];

            if (propertyManagers.length > 0) {
              const newEmails = propertyManagers
                .map(row => Array.isArray(row.email) ? row.email : [row.email])
                .flat()
                .filter((email): email is string =>
                  typeof email === 'string' &&
                  email.includes('@') &&
                  !addedEmails.has(email)
                );

              if (newEmails.length > 0) {
                try {
                  const addEmailsResponse = await fetch("https://api.instantly.ai/api/v2/leads/bulk", {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${process.env.INSTANTLY_API_KEY}`,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      campaign_id: campaignId,
                      leads: newEmails.map(email => ({ email }))
                    })
                  });

                  if (!addEmailsResponse.ok) {
                    const errorData = await addEmailsResponse.json() as { message?: string };
                    throw new Error(errorData.message ?? "Failed to add emails");
                  }

                  newEmails.forEach(email => addedEmails.add(email));
                  console.log(`Added ${newEmails.length} new emails to campaign ${campaignId}. Total: ${addedEmails.size}`);
                } catch (addError) {
                  console.error(`Error adding emails to campaign ${campaignId}:`, addError);
                  void sendSlackMessage({
                    isProductionOnly: true,
                    channel: "tramona-errors",
                    text: [
                      `*Error adding emails to campaign ${campaignId} for request ${transactionResults.requestId}*`,
                      `Location: ${input.location}`,
                      `Error: ${String(addError)}`,
                    ].join("\n"),
                  });
                }
              }
            }

            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
          }

          if (addedEmails.size === 0) {
            console.warn(`No emails added to campaign ${campaignId} after polling`);
          }
        } catch (scraperError) {
          console.error(`Error scheduling scraper:`, scraperError);
          void sendSlackMessage({
            isProductionOnly: true,
            channel: "tramona-errors",
            text: [
              `*Error scheduling scraper for request ${transactionResults.requestId}*`,
              `Location: ${input.location}`,
              `Error: ${String(scraperError)}`,
            ].join("\n"),
          });
        }
      }

    } catch (error) {
      console.error("Error in campaign creation process:", error);
      void sendSlackMessage({
        isProductionOnly: true,
        channel: "tramona-errors",
        text: [
          `*Error in campaign process for request ${transactionResults.requestId}*`,
          `Location: ${input.location}`,
          `Error: ${String(error)}`,
        ].join("\n"),
      });
    }
  })();

  // Use void to ignore the promise result
  void waitUntil(campaignPromise);

  return transactionResults;
}

export async function generateFakeRequest(
  location: string,
  checkIn: Date,
  checkOut: Date,
  numGuests: number,
  maxTotalPrice: number,
) {
  const fakeUserId = await generateFakeUser("fake-user@gmail.com");
  const fakeUser = await db.query.users.findFirst({
    where: eq(users.id, fakeUserId),
  });
  if (!fakeUser) {
    throw new Error("Fake user not found");
  }
  const fakeRequest = await handleRequestSubmission(
    {
      location,
      checkIn,
      checkOut,
      numGuests,
      maxTotalPrice,
    },
    { user: fakeUser },
  );
  return fakeRequest;
}