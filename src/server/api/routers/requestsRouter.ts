import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  MAX_REQUEST_GROUP_SIZE,
  groupMembers,
  groups,
  requestGroups,
  requestInsertSchema,
  requestSelectSchema,
  requests,
  users,
  requestUpdatedInfo,
  properties,
} from "@/server/db/schema";
import { sendSlackMessage } from "@/server/slack";
import { isIncoming } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { and, count, eq, exists } from "drizzle-orm";
import { z } from "zod";
import { sendText, sendWhatsApp } from "@/server/server-utils";
import { groupBy } from "lodash";

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
    console.log("getting all");
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

  createMultiple: protectedProcedure
    .input(
      requestInsertSchema
        .omit({ madeByGroupId: true, requestGroupId: true })
        .array()
        .min(1)
        .max(MAX_REQUEST_GROUP_SIZE),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const requestGroupId = await tx
          .insert(requestGroups)
          .values({ createdByUserId: ctx.user.id })
          .returning()
          .then((res) => res[0]!.id);

        const results = await Promise.allSettled(
          input.map(async (req) => {
            const madeByGroupId = await tx
              .insert(groups)
              .values({ ownerId: ctx.user.id })
              .returning()
              .then((res) => res[0]!.id);

            await tx.insert(groupMembers).values({
              userId: ctx.user.id,
              groupId: madeByGroupId,
            });

            await tx.insert(requests).values({
              ...req,
              madeByGroupId,
              requestGroupId,
            });
          }),
        );

        results.forEach((result) => {
          if (result.status === "rejected") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: JSON.stringify(result.reason),
            });
          }
        });
      });

      if (ctx.user.isWhatsApp) {
        void sendWhatsApp({
          templateId: "HXaf0ed60e004002469e866e535a2dcb45",
          to: ctx.user.phoneNumber!,
        });
      } else {
        void sendText({
          to: ctx.user.phoneNumber!,
          content:
            "You just submitted a request on Tramona! Reply 'YES' if you're serious about your travel plans and we can send the request to our network of hosts!",
        });
      }

      if (env.NODE_ENV !== "production") return;

      const name = ctx.user.name ?? ctx.user.email ?? "Someone";

      if (input.length > 1) {
        sendSlackMessage(
          `*${name} just made ${input.length} requests*`,
          `<https://tramona.com/admin|Go to admin dashboard>`,
        );

        return;
      }

      const request = input[0]!;

      const pricePerNight =
        request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
      const fmtdPrice = formatCurrency(pricePerNight);
      const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
      const fmtdNumGuests = plural(request.numGuests ?? 1, "guest");

      sendSlackMessage(
        `*${name} just made a request: ${request.location}*`,
        `requested ${fmtdPrice}/night · ${fmtdDateRange} · ${fmtdNumGuests}`,
        `<https://tramona.com/admin|Go to admin dashboard>`,
      );
    }),

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
            content: `Your request to ${request.location} has been rejected, please submit another request with looser requirements.`,
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
    .query(async ({ ctx, input: propertyId }) => {
      const hostId = await db.query.properties
        .findFirst({
          columns: { hostId: true },
          where: eq(properties.id, propertyId),
        })
        .then((res) => res?.hostId);

      if (hostId != ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await db.query.requestsToProperties.findMany({
        where: eq(properties.id, propertyId),
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
      });
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
});
