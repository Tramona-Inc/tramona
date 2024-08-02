import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  groupMembers,
  groups,
  requestGroups,
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
  scrapeUsingLink,
  getPropertiesForRequest,
} from "@/server/server-utils";
import { sendSlackMessage } from "@/server/slack";
import { isIncoming } from "@/utils/formatters";
import { formatCurrency, formatDateRange, plural } from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { and, count, eq, exists } from "drizzle-orm";
import { groupBy } from "lodash";
import { z } from "zod";
import type { Session } from "next-auth";

const updateRequestInputSchema = z.object({
  requestId: z.number(),
  updatedRequestInfo: z.object({
    preferences: z.string().optional(),
    updatedPriceNightlyUSD: z.number().optional(),
    propertyLinks: z.array(z.string().url()).optional(),
  }),
});

export const requestsRouter = createTRPCRouter({
  getMyRequestsPublic: publicProcedure.query(async ({ ctx }) => {
    const groupedRequests = await ctx.db.query.requests
      .findMany({
        where: exists(
          db
            .select()
            .from(groupMembers)
            .where(
              and(
                eq(groupMembers.groupId, requests.madeByGroupId),
                // eq(groupMembers.userId, ctx.user.id),
              ),
            ),
        ),
        with: {
          offers: { columns: { id: true } },
          requestGroup: true,
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
        requests
          .map(({ offers, ...request }) => ({
            ...request,
            numOffers: offers.length,
          }))
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              b.createdAt.getTime() - a.createdAt.getTime(),
          ),
      )

      // 2. group by requestGroupId
      .then((requests) => {
        const groups = groupBy(requests, (req) => req.requestGroupId);
        return Object.entries(groups).map(([_, requests]) => ({
          group: requests[0]!.requestGroup,
          requests,
        }));
      });

    // 3. group by active/inactive (and put partially-active groups on active)
    const activeRequestGroups = groupedRequests.filter((group) =>
      group.requests.some((request) => request.resolvedAt === null),
    );

    const inactiveRequestGroups = groupedRequests.filter(
      (group) => !activeRequestGroups.includes(group),
    );

    return {
      activeRequestGroups,
      inactiveRequestGroups,
    };
  }),
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const groupedRequests = await ctx.db.query.requests
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
          offers: { columns: { id: true } },
          requestGroup: true,
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
        requests
          .map(({ offers, ...request }) => ({
            ...request,
            numOffers: offers.length,
          }))
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              b.createdAt.getTime() - a.createdAt.getTime(),
          ),
      )

      // 2. group by requestGroupId
      .then((requests) => {
        const groups = groupBy(requests, (req) => req.requestGroupId);
        return Object.entries(groups).map(([_, requests]) => ({
          group: requests[0]!.requestGroup,
          requests,
        }));
      });

    // 3. group by active/inactive (and put partially-active groups on active)
    const activeRequestGroups = groupedRequests.filter((group) =>
      group.requests.some((request) => request.resolvedAt === null),
    );

    const inactiveRequestGroups = groupedRequests.filter(
      (group) => !activeRequestGroups.includes(group),
    );

    return {
      activeRequestGroups,
      inactiveRequestGroups,
    };
  }),

  getAll: roleRestrictedProcedure(["admin"]).query(async () => {
    z;
    return await db.query.requests
      .findMany({
        with: {
          offers: { columns: { id: true } },
          requestGroup: true,
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
        requests
          .map(({ offers, ...request }) => ({
            ...request,
            numOffers: offers.length,
          }))
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
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
        requestGroupId: true,
        latLngPoint: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { transactionResults } = await handleRequestSubmission(input, {
        user: ctx.user,
      });
      return { transactionResults };
    }),

  createRequestWithLink: protectedProcedure
    .input(
      requestInsertSchema
        .omit({
          location: true,
          maxTotalPrice: true,
          madeByGroupId: true,
          requestGroupId: true,
          latLngPoint: true,
        })
        .extend({
          airbnbLink: z.string().url(),
          numGuests: z.number().min(1),
        }),
    )
    .mutation(async ({ ctx, input }) => {
      //we are going to use the given data to scrape the airbnb listing and create a request
      const response = await scrapeUsingLink(input.airbnbLink);

      const newRequest: RequestInput = {
        ...input,
        location: response.cityName,
        maxTotalPrice: response.formattedNightlyPrice,
      };
      //now we need to make a legitimate request with all of the data
      const { transactionResults } = await handleRequestSubmission(newRequest, {
        user: ctx.user,
      });
      return { transactionResults };
    }),

  // createMultiple: protectedProcedure
  //   .input(
  //     requestInsertSchema
  //       .omit({ madeByGroupId: true, requestGroupId: true })
  //       .array()
  //       .min(1)
  //       .max(MAX_REQUEST_GROUP_SIZE),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const transactionResults = await ctx.db.transaction(async (tx) => {
  //       const requestGroupId = await tx
  //         .insert(requestGroups)
  //         .values({ createdByUserId: ctx.user.id })
  //         .returning()
  //         .then((res) => res[0]!.id);

  //       const results = await Promise.all(
  //         input.map(async (req) => {
  //           const madeByGroupId = await tx
  //             .insert(groups)
  //             .values({ ownerId: ctx.user.id })
  //             .returning()
  //             .then((res) => res[0]!.id);

  //           await tx.insert(groupMembers).values({
  //             userId: ctx.user.id,
  //             groupId: madeByGroupId,
  //           });
  //           const { requestId } = await tx.insert(requests).values({
  //             ...req,
  //             madeByGroupId,
  //             requestGroupId,
  //           })
  //             .returning({ requestId: requests.id })
  //             .then((res) => {
  //               if (!res[0]) {
  //                 throw new Error("Failed to insert request");
  //               }
  //               console.log('Inserted request with ID:', res[0].requestId);
  //               return res[0];
  //             });

  //           async function isPropertyAvailable(propertyId: number, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  //             const overlappingBookings = await db
  //               .select()
  //               .from(bookedDates)
  //               .where(
  //                 and(eq(bookedDates.propertyId, propertyId), between(bookedDates.date, checkInDate, checkOutDate)),
  //               )
  //               .limit(1);

  //             return overlappingBookings.length === 0;
  //           }

  //           async function getPropertyIdsInLocation(input: { location: string, radius: number | null, lat: number | null, lng: number | null }) {
  //             const { location, radius, lat, lng } = input;

  //             let propertyIdsInLocation;

  //             if (radius === null || lat === null || lng === null) {
  //               const coordinates = await getCoordinates(location);
  //               if (!coordinates.bounds) {
  //                 throw new Error('Bounds are undefined');
  //               }
  //               const { northeast, southwest } = coordinates.bounds;
  //               // Use address-based filtering
  //               propertyIdsInLocation = await db.query.properties.findMany({
  //                 where: and(and(and(and(gte(properties.latitude, southwest.lat), lte(properties.latitude, northeast.lat)), gte(properties.longitude, southwest.lng)), lte(properties.longitude, northeast.lng)), isNotNull(properties.hostId)),
  //                 columns: { id: true },
  //               }).then((res) => res.map((r) => r.id));
  //             } else {
  //               // Use radius-based filtering
  //               const earthRadiusMiles = 3959; // Earth's radius in miles

  //               propertyIdsInLocation = await db.query.properties.findMany({
  //                 where: and(
  //                   isNotNull(properties.hostId),
  //                   sql`(
  //                       ${earthRadiusMiles} * acos(
  //                         cos(radians(${lat})) * cos(radians(${properties.latitude})) * cos(radians(${properties.longitude}) - radians(${lng})) +
  //                         sin(radians(${lat})) * sin(radians(${properties.latitude}))
  //                       )
  //                     ) <= ${radius}`
  //                 ),
  //                 columns: { id: true },
  //               }).then((res) => res.map((r) => r.id));
  //             }

  //             return propertyIdsInLocation;
  //           }

  //           const propertyIdsInLocation = await getPropertyIdsInLocation({ location: input[0]!.location, radius: input[0]!.radius ?? null, lat: input[0]!.lat ?? null, lng: input[0]!.lng ?? null });

  //           for (const propertyId of propertyIdsInLocation) {
  //             const isAvailable = await isPropertyAvailable(propertyId, input[0]!.checkIn, input[0]!.checkOut);

  //             if (isAvailable) {
  //               await db.insert(requestsToProperties).values({
  //                 requestId: requestId,
  //                 propertyId: propertyId,
  //               });
  //             }
  //           }

  //           return { madeByGroupId, requestGroupId };
  //         }),
  //       );
  //       //   results.forEach((result) => {
  //       //     if (result.status === "rejected") {
  //       //       throw new TRPCError({
  //       //         code: "INTERNAL_SERVER_ERROR",
  //       //         message: JSON.stringify(result.reason),
  //       //       });
  //       //     }
  //       //   });
  //       // });

  //       return { madeByGroupIds: results.map(r => r.madeByGroupId), results };
  //     });

  //     // if (ctx.user.isWhatsApp) {
  //     //   void sendWhatsApp({
  //     //     templateId: "HXaf0ed60e004002469e866e535a2dcb45",
  //     //     to: ctx.user.phoneNumber!,
  //     //   });
  //     // } else {
  //     //   void sendText({
  //     //     to: ctx.user.phoneNumber!,
  //     //     content:
  //     //       "You just submitted a request on Tramona! Reply 'YES' if you're serious about your travel plans and we can send the request to our network of hosts!",
  //     //   });
  //     // }

  //     // if (env.NODE_ENV !== "production") return;

  //     const { madeByGroupIds, results } = transactionResults;

  //     const name = ctx.user.name ?? ctx.user.email;

  //     if (input.length > 1) {
  //       sendSlackMessage(
  //         `*${name} just made ${input.length} requests*`,
  //         `<https://tramona.com/admin|Go to admin dashboard>`,
  //       );
  //     } else {
  //       const request = input[0]!;

  //       const pricePerNight =
  //         request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
  //       const fmtdPrice = formatCurrency(pricePerNight);
  //       const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  //       const fmtdNumGuests = plural(request.numGuests ?? 1, "guest");

  //       sendSlackMessage(
  //         `*${name} just made a request: ${request.location}*`,
  //         `requested ${fmtdPrice}/night · ${fmtdDateRange} · ${fmtdNumGuests}`,
  //         `<https://tramona.com/admin|Go to admin dashboard>`,
  //       );
  //     }

  //     return { madeByGroupIds, results };
  //   }),

  // resolving a request with no offers = reject

  // requests are automatically resolved when they have offers but
  // this might change in the future (e.g. "here's an offer but more are on the way")

  // Only admins can reject requests for now

  // in the future, well need to validate that a host actually received the request,
  // or else a malicious host could reject any request
  updateConfirmation: protectedProcedure
    .input(z.object({ requestGroupId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(requestGroups)
        .set({ confirmationSentAt: new Date() })
        .where(eq(requestGroups.id, input.requestGroupId));

      if (ctx.user.isWhatsApp) {
        await sendWhatsApp({
          templateId: "HXaf0ed60e004002469e866e535a2dcb45",
          to: ctx.user.phoneNumber!,
        });
      } else {
        await sendText({
          to: ctx.user.phoneNumber!,
          content:
            "You just submitted a request on Tramona! Reply 'YES' if you're serious about your travel plans and we can send the request to our network of hosts!",
        });
      }
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

      const remainingRequests = await ctx.db
        .select({ count: count() })
        .from(requests)
        .where(eq(requests.requestGroupId, input.id))
        .then((res) => res[0]?.count ?? 0);

      if (remainingRequests === 0) {
        await ctx.db
          .delete(requestGroups)
          .where(eq(requestGroups.id, input.id));
      }
    }),

  // update request
  // todo: slack message
  updateRequest: protectedProcedure
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
  requestGroupId: true,
  latLngPoint: true,
});

// Infer the type from the modified schema
type RequestInput = z.infer<typeof modifiedRequestSchema>;

export async function handleRequestSubmission(
  input: RequestInput,
  { user }: { user: Session["user"] },
) {
  // Begin a transaction
  console.log("User ID:", user.id);
  const transactionResults = await db.transaction(async (tx) => {
    const requestGroupId = await tx
      .insert(requestGroups)
      .values({ createdByUserId: user.id })
      .returning()
      .then((res) => res[0]!.id);
    console.log("Request Group ID:", requestGroupId);
    const madeByGroupId = await tx
      .insert(groups)
      .values({ ownerId: user.id })
      .returning()
      .then((res) => res[0]!.id);
    console.log("Made By Group ID:", madeByGroupId);
    await tx.insert(groupMembers).values({
      userId: user.id,
      groupId: madeByGroupId,
    });

    const { requestId } = await tx
      .insert(requests)
      .values({
        ...input,
        madeByGroupId,
        requestGroupId,
      })
      .returning({ requestId: requests.id })
      .then((res) => res[0]!);

    const propertyIds = await getPropertiesForRequest(
      { ...input, id: requestId },
      { tx },
    );

    if (propertyIds.length > 1) {
      await tx
        .insert(requestsToProperties)
        .values(propertyIds.map((propertyId) => ({ requestId, propertyId })));
    }

    return { requestId, madeByGroupId };
  });

  // Messaging based on user preferences or environment
  const name = user.name ?? user.email;
  const pricePerNight = input.maxTotalPrice;
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(input.checkIn, input.checkOut);
  const fmtdNumGuests = plural(input.numGuests ?? 1, "guest");
  console.log(input.maxTotalPrice, " and this is the formatedPrice", fmtdPrice);

  sendSlackMessage(
    [
      `*${name} just made a request: ${input.location}*`,
      `requested ${fmtdPrice}/night · ${fmtdDateRange} · ${fmtdNumGuests}`,
      `<https://tramona.com/admin|Go to admin dashboard>`,
    ].join("\n"),
  );

  return { transactionResults };
}
