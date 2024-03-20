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
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendText } from "@/server/server-utils";

async function createGroup({
  ownerId,
  _db = db,
}: {
  ownerId?: string;
  _db?: typeof db;
}) {
  const groupId = await _db
    .insert(groups)
    .values({})
    .returning()
    .then((res) => res[0]!.id);

  if (ownerId) {
    await _db
      .insert(groupMembers)
      .values({ groupId, userId: ownerId, isOwner: true });
  }

  return groupId;
}

export const requestsRouter = createTRPCRouter({
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const groupedRequests = await ctx.db.query.groupMembers
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

      .then((res) => {
        const ungroupedRequests = res

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
          );

        // 4. group
        const groupedRequests: {
          groupId: number;
          requests: typeof ungroupedRequests;
        }[] = [];

        for (const request of ungroupedRequests) {
          const group = groupedRequests.find(
            ({ groupId }) => groupId === request.requestGroupId,
          );

          if (group) {
            group.requests.push(request);
          } else {
            groupedRequests.push({
              groupId: request.requestGroupId,
              requests: [request],
            });
          }
        }

        return groupedRequests;
      });

    // 5. group by active/inactive (and put partially-active groups on active)

    const activeRequestGroups = groupedRequests.filter((group) =>
      group.requests.some((request) => request.resolvedAt === null),
    );

    const inactiveRequestGroups = groupedRequests.filter(
      (group) => !activeRequestGroups.includes(group),
    );

    // 5. all done

    return {
      activeRequestGroups,
      inactiveRequestGroups,
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
          .values({})
          .returning()
          .then((res) => res[0]!.id);

        const results = await Promise.allSettled(
          input.map(async (req) => {
            const madeByGroupId = await createGroup({
              ownerId: ctx.user.id,
              _db: tx,
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

      void sendText({
        to: ctx.user.phoneNumber!,
        content:
          "You just submitted a request on Tramona! Reply 'YES' if you're serious about your travel plans and we can send the request to our network of hosts!",
      });

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
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(requests)
        .set({ confirmationSentAt: new Date() })
        .where(eq(requests.id, input.requestId));

      await sendText({
        to: ctx.user.phoneNumber!,
        content:
          "You just submitted a request on Tramona! Reply 'YES' if you're serious about your travel plans and we can send the request to our network of hosts!",
      });
    }),

  resolve: roleRestrictedProcedure(["admin"])
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        columns: {
          location: true,
          checkIn: true,
          checkOut: true,
        },
        with: {
          madeByGroup: { with: { members: true } },
        },
      });

      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db
        .update(requests)
        .set({ resolvedAt: new Date() })
        .where(eq(requests.id, input.id));

      const ownerId = request.madeByGroup.members.find(
        (member) => member.isOwner,
      )!.userId;

      const ownerPhoneNumber = await ctx.db.query.users
        .findFirst({
          where: eq(users.id, ownerId),
          columns: { phoneNumber: true },
        })
        .then((res) => res?.phoneNumber);

      if (ownerPhoneNumber) {
        void sendText({
          to: ownerPhoneNumber,
          content: `Your request to ${request.location} has been rejected, please submit another request with looser requirements.`,
        });
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
