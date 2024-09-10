import {
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
  requestUpdatedInfo,
  requests,
  requestsToProperties,
  users,
} from "@/server/db/schema";
import {
  sendText,
  sendWhatsApp,
  getPropertiesForRequest,
} from "@/server/server-utils";
import { sendSlackMessage } from "@/server/slack";
import { isIncoming } from "@/utils/formatters";
import { TRPCError } from "@trpc/server";
import { and, eq, exists } from "drizzle-orm";
import { z } from "zod";
import type { Session } from "next-auth";
import { linkInputProperties } from "@/server/db/schema/tables/linkInputProperties";
import {
  formatCurrency,
  getNumNights,
  formatDateRange,
  plural,
} from "@/utils/utils";
import { sendTextToHost } from "@/server/server-utils";
import { newLinkRequestSchema } from "@/utils/useSendUnsentRequests";
import { random } from "lodash";

const updateRequestInputSchema = z.object({
  requestId: z.number(),
  updatedRequestInfo: z.object({
    preferences: z.string().optional(),
    updatedPriceNightlyUSD: z.number().optional(),
    propertyLinks: z.array(z.string().url()).optional(),
  }),
});

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
              travelerOfferedPrice: true,
              createdAt: true,
              checkIn: true,
              checkOut: true,
              randomDirectListingDiscount: true,
              datePriceFromAirbnb: true,
            },
            with: {
              property: {
                columns: {
                  id: true,
                  imageUrls: true,
                  name: true,
                  numBedrooms: true,
                  numBathrooms: true,
                  originalNightlyPrice: true,
                  hostName: true,
                  hostProfilePic: true,
                },
                with: {
                  host: { columns: { name: true, email: true, image: true } },
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

    return {
      activeRequests: myRequests.filter(
        (request) => request.resolvedAt === null,
      ),
      inactiveRequests: myRequests.filter(
        (request) => request.resolvedAt !== null,
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
      requestInsertSchema.omit({
        madeByGroupId: true,
        latLngPoint: true,
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

  update: protectedProcedure
    .input(updateRequestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { requestId, updatedRequestInfo } = input;

      // serialize propertyLinks to a JSON string
      const serializedpropertyLinks = JSON.stringify(
        updatedRequestInfo.propertyLinks,
      );

      const infoToUpdate = {
        ...updatedRequestInfo,
        propertyLinks: serializedpropertyLinks, // use the serialized string for DB storage
      };

      const existingUpdatedInfo =
        await ctx.db.query.requestUpdatedInfo.findFirst({
          where: eq(requestUpdatedInfo.requestId, requestId),
        });

      if (existingUpdatedInfo) {
        await ctx.db
          .update(requestUpdatedInfo)
          .set(infoToUpdate)
          .where(eq(requestUpdatedInfo.id, existingUpdatedInfo.id));
      } else {
        await ctx.db.insert(requestUpdatedInfo).values({
          requestId,
          ...infoToUpdate,
        });
      }
    }),
  checkRequestUpdate: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { requestId } = input;
      const existingUpdate = await ctx.db.query.requestUpdatedInfo.findFirst({
        where: eq(requestUpdatedInfo.requestId, requestId),
      });

      if (existingUpdate) {
        return { alreadyUpdated: true };
      } else {
        return { alreadyUpdated: false };
      }
    }),

  getByPropertyId: protectedProcedure
    .input(z.number())
    .query(async ({ input: propertyId }) => {
      // const hostId = await db.query.properties
      //   .findFirst({
      //     columns: { hostId: true },
      //     where: eq(properties.id, propertyId),
      //   })
      //   .then((res) => res?.hostId);

      // if (hostId != ctx.user.id) {
      //   throw new TRPCError({ code: "UNAUTHORIZED" });
      // }

      return await db.query.requestsToProperties
        .findMany({
          where: eq(requestsToProperties.propertyId, propertyId),
          with: {
            request: {
              with: {
                madeByGroup: {
                  with: {
                    members: {
                      with: {
                        user: {
                          columns: {
                            name: true,
                            email: true,
                            image: true,
                            id: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        })
        .then((res) => res.map((r) => r.request));
    }),

  // todo - change this when updaterequestinfo is not one to one anymore
  getUpdatedRequestInfo: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { requestId } = input;
      const updateInfo = await ctx.db.query.requestUpdatedInfo.findFirst({
        where: eq(requestUpdatedInfo.requestId, requestId),
      });

      if (!updateInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No updated info found for request with ID ${requestId}`,
        });
      }

      let deserializedPropertyLinks: any[] = [];
      if (updateInfo.propertyLinks !== null) {
        try {
          deserializedPropertyLinks = JSON.parse(
            updateInfo.propertyLinks,
          ) as any[];
        } catch (e) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to parse propertyLinks",
          });
        }
      }

      return {
        ...updateInfo,
        propertyLinks: deserializedPropertyLinks,
      };
    }),

  rejectRequest: protectedProcedure
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(requestsToProperties)
        .where(eq(requestsToProperties.requestId, input.requestId));
    }),
});

//Reusable functions
const modifiedRequestSchema = requestInsertSchema.omit({
  madeByGroupId: true,
  latLngPoint: true,
});

// Infer the type from the modified schema
type RequestInput = z.infer<typeof modifiedRequestSchema>;

export async function handleRequestSubmission(
  input: RequestInput,
  { user }: { user: Session["user"] },
) {
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

    const requestId = await tx
      .insert(requests)
      .values({ ...input, madeByGroupId })
      .returning()
      .then((res) => res[0]!.id);

    const eligibleProperties = await getPropertiesForRequest(
      { ...input, id: requestId },
      { tx },
    );

    if (eligibleProperties.length > 0) {
      await tx.insert(requestsToProperties).values(
        eligibleProperties.map((property) => ({
          requestId,
          propertyId: property.id,
        })),
      );

      await sendTextToHost(
        eligibleProperties,
        input.checkIn,
        input.checkOut,
        input.maxTotalPrice,
        input.location,
      );
    }

    // waitUntil(
    //   scrapeAirbnbListings({
    //     request: input,
    //     limit: 10,
    //   })
    //     .then(async (airbnbListings) => {
    //       const airbnbPropertyIds = await tx
    //         .insert(properties)
    //         .values(airbnbListings.map((l) => l.property))
    //         .returning({ id: properties.id })
    //         .then((res) => res.map((r) => r.id));

    //       const flattenedReviews = airbnbListings
    //         .map(({ reviews }, i) =>
    //           reviews.map((r) => ({ ...r, propertyId: airbnbPropertyIds[i]! })),
    //         )
    //         .flat();

    //       await tx.insert(reviews).values(flattenedReviews);
    //     })
    //     .catch((e) => {
    //       // fail silently -- we dont want to crash the request submission
    //       // TODO: handle this better using a dead letter queue or something
    //       console.error(
    //         `Error scraping Airbnb listings for request #${requestId}: ${e}`,
    //       );
    //     }),
    // );

    return { requestId, madeByGroupId };
  });

  // Messaging based on user preferences or environment
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
