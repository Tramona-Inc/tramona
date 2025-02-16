import {
  coHostProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  groupMembers,
  requestInsertSchema,
  requestSelectSchema,
  requests,
  users,
  offers,
  rejectedRequests,
  properties,
  Property,
  User,
  Request,
} from "@/server/db/schema";
import {
  sendText,
  sendWhatsApp,
  getPropertiesForRequest,
  getRequestsForProperties,
} from "@/server/server-utils";
import { isIncoming } from "@/utils/formatters";
import { TRPCError } from "@trpc/server";
import { and, eq, exists, lt } from "drizzle-orm";
import { z } from "zod";
import { linkInputProperties } from "@/server/db/schema/tables/linkInputProperties";
import { newLinkRequestSchema } from "@/utils/useSendUnsentRequests";
import { handleRequestSubmission } from "@/server/request-utils";

export const requestsRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(requestSelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        with: {
          madeByGroup: { columns: { ownerId: true } },
        },
      });

      if (!request) {
        throw new Error("Request not found");
      }

      const propertiesForRequest = await getPropertiesForRequest(request, {
        tx: ctx.db,
      });

      const traveler = await ctx.db.query.users.findFirst({
        where: eq(users.id, request.madeByGroup.ownerId),
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          image: true,
          location: true,
          about: true,
          dateOfBirth: true,
        },
      });

      return {
        ...request,
        traveler,
        properties: propertiesForRequest,
      };
    }),

  getByIdForPreview: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        with: {
          madeByGroup: { columns: { ownerId: true } },
        },
      });

      if (!request) {
        throw new Error("Request not found");
      }

      const traveler = await ctx.db.query.users.findFirst({
        where: eq(users.id, request.madeByGroup.ownerId),
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          image: true,
          location: true,
          about: true,
          dateOfBirth: true,
        },
      });

      return {
        ...request,
        traveler,
      };
    }),

  getByIdForHost: protectedProcedure
    .input(z.object({ id: z.number(), hostTeamId: z.number() }))
    .query(async ({ ctx, input }) => {
      console.log("getById");
      // Fetch properties with requests, filter for just the host team of the request
      const allHostData = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        with: {
          madeByGroup: { columns: { ownerId: true } },
        },
      });

      if (!allHostData) {
        throw new Error("Request not found");
      }

      const hostTeamId = input.hostTeamId;

      const hostData = await ctx.db.query.properties.findMany({
        where: and(
          eq(properties.hostTeamId, hostTeamId),
          eq(properties.status, "Listed"),
        ),
      });

      console.log(hostData, "hostData");

      const hostRequests = await getRequestsForProperties(hostData);

      console.log(hostRequests, "hostRequests");

      //Filter the results to match the specific request
      let foundRequest:
        | {
            request: Request & {
              traveler: Pick<
                User,
                | "firstName"
                | "lastName"
                | "name"
                | "image"
                | "location"
                | "about"
                | "dateOfBirth"
                | "id"
              >;
            };
            properties: (Property & { taxAvailable: boolean })[];
          }
        | undefined;
      for (const { property, request } of hostRequests) {
        console.log(request.id, "request.id");
        console.log(input.id, "input.id");
        if (request.id === input.id) {
          foundRequest = { request, properties: [{ ...property }] }; // I am getting issues with types here, is there something I need to change?
        }
      }

      if (!foundRequest) {
        throw new Error("Request not found for this host team");
      }

      return foundRequest;
    }),

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
              calculatedTravelerPrice: true,
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
          request.resolvedAt === null &&
          request.createdAt > fortyEightHoursAgo &&
          request.status === "Pending",
      ),
      inactiveRequests: myRequests.filter(
        (request) =>
          request.resolvedAt !== null ||
          request.createdAt < fortyEightHoursAgo ||
          request.status !== "Pending",
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
        .set({ resolvedAt: new Date(), status: "Resolved" })
        .where(eq(requests.id, input.id));

      const owner = await ctx.db.query.users.findFirst({
        where: eq(users.id, request.madeByGroup.ownerId),
        columns: { phoneNumber: true, isWhatsApp: true, isBurner: true },
      });

      if (owner && !owner.isBurner) {
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

  withdraw: protectedProcedure
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

      await ctx.db
        .update(requests)
        .set({ status: "Withdrawn" })
        .where(eq(requests.id, input.id));
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
