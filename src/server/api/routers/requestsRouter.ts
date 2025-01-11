import {
  coHostProcedure,
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  groupMembers,
  groups,
  requestInsertSchema,
  requestSelectSchema,
  requests,
  users,
  offers,
  rejectedRequests,
  properties,
} from "@/server/db/schema";
import {
  sendText,
  sendWhatsApp,
  getPropertiesForRequest,
  createLatLngGISPoint,
} from "@/server/server-utils";
import { sendSlackMessage } from "@/server/slack";
import { isIncoming } from "@/utils/formatters";
import { TRPCError } from "@trpc/server";
import { and, eq, exists, lt } from "drizzle-orm";
import { z } from "zod";
import type { Session } from "next-auth";
import { linkInputProperties } from "@/server/db/schema/tables/linkInputProperties";
import {
  formatCurrency,
  getNumNights,
  formatDateRange,
  plural,
  getHostPayout,
  getTravelerOfferedPrice,
} from "@/utils/utils";
import { sendTextToHost, haversineDistance } from "@/server/server-utils";
import { newLinkRequestSchema } from "@/utils/useSendUnsentRequests";
import { getCoordinates } from "@/server/google-maps";
import { scrapeDirectListings } from "@/server/direct-sites-scraping";
import { waitUntil } from "@vercel/functions";
import { scrapeAirbnbPrice } from "@/server/scrapePrice";
import { TRAVELER_MARKUP } from "@/utils/constants";
import { differenceInDays } from "date-fns";

export const requestsRouter = createTRPCRouter({
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const myRequests = await ctx.db.query.requests
      .findMany({
        where: exists(
          db
            .select()
            .from(groupMembers)
            .where(
              and(
                eq(groupMembers.groupId, requests.madeByGroupId),
                eq(groupMembers.userId, ctx.user.id),
              ),
            ),
        ),
        with: {
          offers: {
            columns: {
              id: true,
              travelerOfferedPriceBeforeFees: true,
              createdAt: true,
              checkIn: true,
              checkOut: true,
              randomDirectListingDiscount: true,
              datePriceFromAirbnb: true,
              scrapeUrl: true,
            },
            where: and(
              eq(offers.status, "Pending"),
              ctx.user.role === "admin"
                ? undefined // show all offers for admins
                : lt(offers.becomeVisibleAt, new Date()),
            ),
            with: {
              property: {
                columns: {
                  id: true,
                  imageUrls: true,
                  name: true,
                  numBedrooms: true,
                  numBathrooms: true,
                  originalNightlyPrice: true,
                  originalListingUrl: true,
                  hostName: true,
                  hostProfilePic: true,
                  bookOnAirbnb: true,
                },
                with: {
                  hostTeam: {
                    with: {
                      owner: {
                        columns: { name: true, email: true, image: true },
                      },
                    },
                  },
                },
              },
            },
          },
          linkInputProperty: true,
          madeByGroup: {
            with: {
              invites: true,
              members: {
                with: {
                  user: {
                    columns: { name: true, email: true, image: true, id: true },
                  },
                },
              },
            },
          },
        },
      })
      // extract offer count & sort
      .then((requests) =>
        requests.sort(
          (a, b) =>
            b.offers.length - a.offers.length ||
            b.createdAt.getTime() - a.createdAt.getTime(),
        ),
      );

    const fortyEightHoursAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    return {
      activeRequests: myRequests.filter(
        (request) =>
          request.resolvedAt === null && request.createdAt > fortyEightHoursAgo,
      ),
      inactiveRequests: myRequests.filter(
        (request) =>
          request.resolvedAt !== null || request.createdAt < fortyEightHoursAgo,
      ),
    };
  }),

  getAll: roleRestrictedProcedure(["admin"]).query(async () => {
    z;
    return await db.query.requests
      .findMany({
        with: {
          offers: { columns: { id: true } },
          linkInputProperty: true,
          madeByGroup: {
            with: {
              invites: true,
              members: {
                with: {
                  user: {
                    columns: { name: true, email: true, image: true, id: true },
                  },
                },
              },
            },
          },
        },
      })
      // 1. extract offer count & sort
      .then((requests) =>
        requests.sort(
          (a, b) =>
            b.offers.length - a.offers.length ||
            b.createdAt.getTime() - a.createdAt.getTime(),
        ),
      )
      .then((res) => {
        return {
          incomingRequests: res.filter((req) => isIncoming(req)),
          pastRequests: res.filter((req) => !isIncoming(req)),
        };
      });
  }),

  create: protectedProcedure
    .input(
      requestInsertSchema
        .omit({
          madeByGroupId: true,
          latLngPoint: true,
        })
        .extend({
          lat: z.number().optional(),
          lng: z.number().optional(),
          radius: z.number().optional(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
      return await handleRequestSubmission(input, { user: ctx.user });
    }),

  createRequestWithLink: protectedProcedure
    .input(newLinkRequestSchema)
    .mutation(async ({ ctx, input: { property, request } }) => {
      const { requestId, madeByGroupId } = await handleRequestSubmission(
        request,
        { user: ctx.user },
      );

      const linkInputPropertyId = await db
        .insert(linkInputProperties)
        .values(property)
        .returning({ id: linkInputProperties.id })
        .then((res) => res[0]!.id);

      await db
        .update(requests)
        .set({ linkInputPropertyId })
        .where(eq(requests.id, requestId));

      return { madeByGroupId };
    }),

  resolve: roleRestrictedProcedure(["admin"])
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        columns: { location: true, checkIn: true, checkOut: true },
        with: {
          madeByGroup: { columns: { ownerId: true } },
        },
      });

      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db
        .update(requests)
        .set({ resolvedAt: new Date() })
        .where(eq(requests.id, input.id));

      const owner = await ctx.db.query.users.findFirst({
        where: eq(users.id, request.madeByGroup.ownerId),
        columns: { phoneNumber: true, isWhatsApp: true },
      });

      if (owner) {
        if (owner.isWhatsApp) {
          void sendWhatsApp({
            templateId: "HX08c870ee406c7ef4ff763917f0b3c411",
            to: owner.phoneNumber!,
            propertyAddress: request.location,
          });
        } else {
          void sendText({
            to: owner.phoneNumber!,
            content: `Your request to ${request.location} has been rejected, please submit another request with different requirements.`,
          });
        }
      }
    }),

  delete: protectedProcedure
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      // Only group owner and admin can delete
      // (or anyone if theres no group owner for whatever reason)

      if (ctx.user.role !== "admin") {
        const groupOwnerId = await ctx.db.query.requests
          .findFirst({
            where: eq(requests.id, input.id),
            columns: {},
            with: {
              madeByGroup: { columns: { ownerId: true } },
            },
          })
          .then((res) => res?.madeByGroup.ownerId);

        if (!groupOwnerId) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        if (ctx.user.id !== groupOwnerId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(requests).where(eq(requests.id, input.id));
    }),

  rejectRequest: coHostProcedure(
    "accept_or_reject_booking_requests",
    z.object({ requestId: z.number(), currentHostTeamId: z.number() }),
  ).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(rejectedRequests).values({
      requestId: input.requestId,
      hostTeamId: input.currentHostTeamId,
    });
  }),
});

//Reusable functions
const modifiedRequestSchema = requestInsertSchema
  .omit({
    madeByGroupId: true,
    latLngPoint: true,
  })
  .extend({
    lat: z.number().optional(),
    lng: z.number().optional(),
    radius: z.number().optional(),
  });

// Infer the type from the modified schema
export type RequestInput = z.infer<typeof modifiedRequestSchema>;

export async function handleRequestSubmission(
  input: RequestInput,
  { user }: { user: Session["user"] },
) {
  // Begin a transaction
  console.log(user);
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

    //TO DO - figure out if i need to get coordinates here or elsewhere

    // if (input.lat === undefined || input.lng === null || input.radius === null) {
    //   const coordinates = await getCoordinates(input.location);
    //   if (coordinates.location) {

    //   }
    // }

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

    for (const property of eligibleProperties) {
      const propertyDetails = await tx.query.properties.findFirst({
        where: eq(properties.id, property.id),
      });

      if (
        propertyDetails?.autoOfferEnabled &&
        propertyDetails.originalListingId &&
        propertyDetails.originalListingPlatform === "Airbnb" &&
        propertyDetails.discountTiers
      ) {
        try {
          const airbnbTotalPrice = await scrapeAirbnbPrice({
            airbnbListingId: propertyDetails.originalListingId,
            params: {
              checkIn: input.checkIn,
              checkOut: input.checkOut,
              numGuests: input.numGuests,
            },
          });

          const airbnbNightlyPrice = airbnbTotalPrice / numNights;

          const percentOff =
            ((airbnbNightlyPrice - requestedNightlyPrice) /
              airbnbNightlyPrice) *
            100;

          const daysUntilCheckIn = differenceInDays(input.checkIn, new Date());

          const applicableDiscount = propertyDetails.discountTiers.find(
            (tier) => daysUntilCheckIn >= tier.days,
          );

          if (
            applicableDiscount &&
            percentOff <= applicableDiscount.percentOff
          ) {
            //create trip checkout First
            const travelerOfferedPriceBeforeFees = getTravelerOfferedPrice({
              totalBasePriceBeforeFees: requestedNightlyPrice * numNights,
              travelerMarkup: TRAVELER_MARKUP,
            });

            await tx.insert(offers).values({
              requestId: request.id,
              propertyId: property.id,
              totalBasePriceBeforeFees: input.maxTotalPrice,
              hostPayout: getHostPayout(requestedNightlyPrice * numNights),
              travelerOfferedPriceBeforeFees,
              checkIn: input.checkIn,
              checkOut: input.checkOut,
            });
          }
        } catch (error) {
          console.error(
            `Error processing auto-offer for property ${property.id}:`,
            error,
          );
        }
      }
    }

    const propertiesWithoutAutoOffers = eligibleProperties.filter(
      (property) => !property.autoOfferEnabled,
    );

    await sendTextToHost({
      matchingProperties: propertiesWithoutAutoOffers,
      request: input,
    });

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
