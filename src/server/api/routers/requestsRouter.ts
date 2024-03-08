import { env } from "@/env";
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
  requests,
} from "@/server/db/schema";
import { sendSlackMessage } from "@/server/slack";
import { getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const requestsRouter = createTRPCRouter({
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const myRequests = await ctx.db.query.groupMembers
      .findMany({
        where: eq(groupMembers.userId, ctx.user.id),
        with: {
          group: {
            with: {
              requests: {
                with: {
                  offers: {
                    with: {
                      property: {
                        with: {
                          host: {
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
              members: {
                with: {
                  user: {
                    columns: { name: true, email: true, image: true, id: true },
                  },
                },
              },
              invites: true,
            },
          },
        },
      })

      // 1. turn the data into a nicer shape
      .then((res) =>
        res
          .map((groupMember) => {
            const {
              group: { requests, members, invites },
            } = groupMember;

            return requests.map((request) => ({
              ...request,
              groupMembers: members.map((member) => ({
                ...member.user,
                isGroupOwner: member.isOwner,
              })),
              groupInvites: invites,
            }));
          })
          .flat(1),
      )

      .then((res) =>
        res

          // 2. extract host images & offers count
          .map((request) => {
            const hostImages = request.offers
              .map((offer) => offer.property.host?.image)
              .filter(Boolean);

            const numOffers = request.offers.length;

            const { offers: _, ...requestExceptOffers } = request;

            return { ...requestExceptOffers, hostImages, numOffers };
          })

          // 3. sort
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              b.createdAt.getTime() - a.createdAt.getTime(),
          ),
      );

    // 4. group by active/inactive

    const activeRequests = myRequests
      .filter((request) => request.resolvedAt === null)
      .map((request) => ({ ...request, resolvedAt: null })); // because ts is dumb

    const inactiveRequests = myRequests
      .filter((request) => request.resolvedAt !== null)
      .map((request) => ({
        ...request,
        resolvedAt: request.resolvedAt ?? new Date(),
      })); // because ts is dumb, new Date will never actually happen

    // 5. all done

    return {
      activeRequests,
      inactiveRequests,
    };
  }),

  getAll: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.requests
      .findMany({
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
                      phoneNumber: true,
                      id: true,
                    },
                  },
                },
              },
              invites: true,
            },
          },
          offers: { columns: { id: true } },
        },
      })
      // doing this until drizzle adds aggregations for
      // relational queries lol
      .then((res) =>
        res
          .map((req) => {
            const { offers, madeByGroup, ...reqWithoutOffers } = req;
            return {
              ...reqWithoutOffers,
              numOffers: offers.length,
              groupMembers: madeByGroup.members.map((member) => ({
                ...member.user,
                isGroupOwner: member.isOwner,
              })),
              groupInvites: madeByGroup.invites,
            };
          })
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              a.createdAt.getTime() - b.createdAt.getTime(),
          ),
      )
      .then((res) => ({
        incomingRequests: res.filter(
          (req) => getRequestStatus(req) === "pending",
        ),
        pastRequests: res.filter((req) => getRequestStatus(req) !== "pending"),
      }));
  }),

  // getAllIncoming: roleRestrictedProcedure(["host", "admin"]).query(
  //   async ({ ctx, input }) => {
  //     // get the requests close to this users properties
  //   },
  // ),

  create: protectedProcedure
    .input(requestInsertSchema.omit({ madeByGroupId: true }))
    .mutation(async ({ ctx, input }) => {
      const groupId = await ctx.db
        .insert(groups)
        .values({})
        .returning()
        .then((res) => res[0]!.id);

      await ctx.db
        .insert(groupMembers)
        .values({ groupId, userId: ctx.user.id, isOwner: true });

      await ctx.db.insert(requests).values({
        ...input,
        madeByGroupId: groupId,
      });

      const name = ctx.user.name ?? ctx.user.email ?? "Someone";
      const pricePerNight =
        input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut);
      const fmtdPrice = formatCurrency(pricePerNight);
      const fmtdDateRange = formatDateRange(input.checkIn, input.checkOut);
      const fmtdNumGuests = plural(input.numGuests ?? 1, "guest");

      if (env.NODE_ENV === "production") {
        sendSlackMessage(
          `*${name} just made a request: ${input.location}*`,
          `requested ${fmtdPrice}/night · ${fmtdDateRange} · ${fmtdNumGuests}`,
          `<https://tramona.com/admin|Go to admin dashboard>`,
        );
      }
    }),

  // 10 requests limit
  createMultiple: protectedProcedure
    .input(requestInsertSchema.omit({ madeByGroupId: true }).array())
    .mutation(async ({ ctx, input }) => {
      if (input.length > 10) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot create more than 10 requests at a time",
        });
      }

      await ctx.db.transaction(async (tx) => {
        const results = await Promise.allSettled(
          input.map(async (req) => {
            // this is all copy pasted from the create procedure above
            // well figure out later how to extract this into a function
            const groupId = await tx
              .insert(groups)
              .values({})
              .returning()
              .then((res) => res[0]!.id);

            await tx
              .insert(groupMembers)
              .values({ groupId, userId: ctx.user.id });

            await tx.insert(requests).values({
              ...req,
              madeByGroupId: groupId,
            });
          }),
        );

        if (results.some((result) => result.status === "rejected")) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      });

      const name = ctx.user.name ?? ctx.user.email ?? "Someone";

      if (env.NODE_ENV === "production") {
        sendSlackMessage(
          `*${name} just made ${input.length} requests*`,
          `<https://tramona.com/admin|Go to admin dashboard>`,
        );
      }
    }),

  // resolving a request with no offers = reject

  // requests are automatically resolved when they have offers but
  // this might change in the future (e.g. "here's an offer but more are on the way")

  // Only admins can reject requests for now

  // in the future, well need to validate that a host actually received the request,
  // or else a malicious host could reject any request

  resolve: roleRestrictedProcedure(["admin"])
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(requests)
        .set({ resolvedAt: new Date() })
        .where(eq(requests.id, input.id));
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
            with: {
              madeByGroup: {
                with: { members: { where: eq(groupMembers.isOwner, true) } },
              },
            },
          })
          .then((request) => request?.madeByGroup.members[0]?.userId);

        if (!groupOwnerId) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        if (ctx.user.id !== groupOwnerId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(requests).where(eq(requests.id, input.id));
    }),
});
