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

  // Store coordinates outside transaction scope
  let coordinates = {
    lat: input.lat,
    lng: input.lng,
    radius: input.radius
  };

  // If coordinates not provided, get them from Google Maps
  if (!coordinates.lat || !coordinates.lng || !coordinates.radius) {
    const googleCoords = await getCoordinates(input.location);
    console.log(googleCoords, "coordinates ");
    if (googleCoords.location) {
      coordinates = {
        lat: googleCoords.location.lat,
        lng: googleCoords.location.lng,
        radius: googleCoords.bounds
          ? haversineDistance(
            googleCoords.bounds.northeast.lat,
            googleCoords.bounds.northeast.lng,
            googleCoords.bounds.southwest.lat,
            googleCoords.bounds.southwest.lng,
          ) / 2
          : 10
      };
    }
  }

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

    let latLngPoint = null;
    if (coordinates.lat && coordinates.lng) {
      latLngPoint = createLatLngGISPoint({
        lat: coordinates.lat,
        lng: coordinates.lng
      });
    }

    const pricePerNight = input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut);
    const totalPrice = input.maxTotalPrice;

    // Send emails to property managers and warm leads
    if (!coordinates.radius || !latLngPoint) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to get coordinates for the location",
      });
    }

    const request = await tx
      .insert(requests)
      .values({
        ...input,
        madeByGroupId,
        latLngPoint,
        radius: coordinates.radius
      })
      .returning({ latLngPoint: requests.latLngPoint, id: requests.id })
      .then((res) => res[0]!);

    // Start the scraper but store the promise
    const scraperPromise = scrapeDirectListings({
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      requestNightlyPrice:
        input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut),
      requestId: request.id,
      location: input.location,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      numGuests: input.numGuests,
    }).catch((error) => {
      console.error("Error scraping listings: " + error);
    });

    // Use waitUntil for both promises
    waitUntil(Promise.all([
      scraperPromise,
      (async () => {
        try {
          // First check if we have ANY existing property managers in this city
          const existingPMQuery = await secondaryDb.execute(sql`
            SELECT COUNT(*) as count
            FROM property_manager_contacts
            WHERE city = ${input.location}
            AND lat_lng_point IS NOT NULL
          `);

          const existingPMCount = Number(existingPMQuery[0]?.count ?? 0);
          console.log(`Found ${existingPMCount} total existing property managers in ${input.location}`);

          let shouldRunScraper = existingPMCount === 0;
          let lastPMCount = existingPMCount;
          let newLeadsFound = false;
          let scraperStarted = false;

          // If no existing leads, trigger scraper
          if (shouldRunScraper) {
            console.log(`No existing leads found for ${input.location}, triggering scraper...`);
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
              scraperStarted = true;
            } catch (scraperError) {
              console.error(`Error scheduling scraper:`, scraperError);
              void sendSlackMessage({
                isProductionOnly: true,
                channel: "tramona-errors",
                text: [
                  `*Error scheduling scraper for request ${request.id}*`,
                  `Location: ${input.location}`,
                  `Error: ${String(scraperError)}`,
                ].join("\n"),
              });
            }
          }

          // Only wait if we actually started the scraper
          if (scraperStarted) {
            console.log(`Starting 3-minute wait period for scraping to complete...`);
            const startTime = Date.now();

            // Poll every 5 seconds for the full 3 minutes
            while (Date.now() - startTime < 180000) { // 3-minute window
              const currentPMQuery = await secondaryDb.execute(sql`
                SELECT COUNT(*) as count
                FROM property_manager_contacts
                WHERE city = ${input.location}
                AND lat_lng_point IS NOT NULL
              `);

              const currentPMCount = Number(currentPMQuery[0]?.count ?? 0);
              if (currentPMCount > lastPMCount) {
                console.log(`Found ${currentPMCount - lastPMCount} new leads (total: ${currentPMCount})`);
                newLeadsFound = true;
                lastPMCount = currentPMCount;
              }

              await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
            }

            // Wait an additional 10 seconds after the timeout to ensure all leads are processed
            await new Promise(resolve => setTimeout(resolve, 10000));
            console.log(`Scraping wait period complete. Proceeding to check for contactable leads...`);
          } else {
            console.log(`No scraper running, proceeding to check for contactable leads...`);
          }

          // Now check for contactable leads
          const warmLeadsQuery = await secondaryDb.execute(sql`
            SELECT COUNT(*) as count
            FROM warm_leads wl
            JOIN cities c ON c.warm_lead_id = wl.id
            WHERE c.name = ${input.location}
            AND (wl.last_email_sent_at IS NULL OR wl.last_email_sent_at < NOW() - INTERVAL '3 days')
          `);

          const recentPMQuery = await secondaryDb.execute(sql`
            SELECT COUNT(*) as count
            FROM property_manager_contacts
            WHERE city = ${input.location}
            AND lat_lng_point IS NOT NULL
            AND (last_email_sent_at IS NULL OR last_email_sent_at < NOW() - INTERVAL '3 days')
          `);

          const newWarmLeadsCount = Number(warmLeadsQuery[0]?.count ?? 0);
          const contactablePMCount = Number(recentPMQuery[0]?.count ?? 0);

          console.log(`Found ${newWarmLeadsCount} new warm leads and ${contactablePMCount} contactable property managers in ${input.location}`);

          // Only create campaign if we have contactable leads
          if (newWarmLeadsCount > 0 || contactablePMCount > 0) {
            // Now create the campaign and add leads
            const campaignId = await createInstantlyCampaign({
              campaignName: `Booking Request: ${input.location} ${formatDateRange(input.checkIn, input.checkOut)}`,
              locationFilter: {
                lat: coordinates.lat ?? 0,
                lng: coordinates.lng ?? 0,
                radiusKm: coordinates.radius ?? 10,
              },
              customVariables: {
                requestLocation: input.location,
                requestId: request.id.toString(),
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
              // If we only have warm leads, only add those
              onlyWarmLeads: contactablePMCount === 0 && newWarmLeadsCount > 0,
              sequences: [{
                steps: [
                  {
                    type: "email",
                    delay: 0,
                    variants: [
                      {
                        subject: `Booking Request for ${input.location}`,
                        body: `
                          Tramona: New Booking Request for ${input.location}

                          We have a new booking request for your property in ${input.location}!

                          Request Details:
                          Location: ${input.location}
                          Dates: ${formatDateRange(input.checkIn, input.checkOut)}
                          Number of guests: ${plural(input.numGuests ?? 1, "guest")}
                          Potential earnings for your empty night: ${input.maxTotalPrice ? formatCurrency(input.maxTotalPrice) : "N/A"}

                          What is Tramona?

                          1. Tramona is the only OTA built to supplement other booking channels, and fill your empty nights
                          2. Tramona charges 5-10% less in fees so every booking puts more in your pocket
                          3. All bookings come with $50,000 of protection.
                          4. Sign up instantly, with our direct Airbnb connection. This auto connects your calendars, pricing, properties and anything else on Airbnb

                          Log in now to review and accept this booking request at: https://tramona.com/request-preview/${request.id}

                          Not quite the booking you're looking for? No worries! We have travelers making requests every day.

                          Questions about this request?
                          Email us at info@tramona.com
                        `.trim(),
                      }
                    ]
                  }
                ]
              }]
            });

            if (!campaignId) {
              console.log("Failed to create campaign - no campaign ID returned");
            } else {
              console.log(`Successfully created and processed campaign ${campaignId}`);
            }
          } else {
            console.log(`No contactable leads found for ${input.location}, skipping campaign creation`);
          }
        } catch (error) {
          console.error("Error in campaign creation process:", error);
          void sendSlackMessage({
            isProductionOnly: true,
            channel: "tramona-errors",
            text: [
              `*Error in campaign process for request ${request.id}*`,
              `Location: ${input.location}`,
              `Error: ${String(error)}`,
            ].join("\n"),
          });
        }
      })()
    ]));

    const eligibleProperties = await getPropertiesForRequest(
      { ...input, id: request.id, latLngPoint: request.latLngPoint, radius: coordinates.radius },
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